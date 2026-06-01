/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Peer, { DataConnection, MediaConnection } from "peerjs";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

const registerPeer = async (
  peerId: string,
  userId: number,
  userType: "doctor" | "patient",
  appointmentId: number
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/peer/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        peerId,
        userId,
        userType,
        appointmentId,
      }),
    });

    if (!response.ok) throw new Error("Failed to register peer");
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const getOtherUserPeerId = async (
  appointmentId: number,
  userType: "doctor" | "patient"
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/peer/other/${appointmentId}/${userType}`
    );
    if (!response.ok) throw new Error("Failed to fetch other user peer ID");
    const data = await response.json();
    return data.otherPeerId;
  } catch (error) {
    return null;
  }
};

const getConnectionStatus = async (appointmentId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/peer/status/${appointmentId}`
    );
    if (!response.ok) throw new Error("Failed to fetch connection status");
    return await response.json();
  } catch (error) {
    return null;
  }
};

const removePeer = async (peerId: string) => {
  try {
    await fetch(`${API_BASE_URL}/peer/${peerId}`, {
      method: "DELETE",
    });
  } catch (error) {}
};
// =====================================================

export default function MeetComponent({
  data,
}: {
  data: {
    type: "doctor" | "patient";
    appointmentId: number;
    doctor: { id: number; name: string };
    patient: { id: number; name: string };
  };
}) {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [inMeeting, setInMeeting] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [doctorJoined, setDoctorJoined] = useState(false);
  const [patientJoined, setPatientJoined] = useState(false);
  const [localStreamReady, setLocalStreamReady] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; sender: string; text: string; timestamp: Date }[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const [soundLevel, setSoundLevel] = useState(0);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [localStreamStats, setLocalStreamStats] = useState({
    videoTracks: 0,
    audioTracks: 0,
  });
  const [remoteStreamStats, setRemoteStreamStats] = useState({
    videoTracks: 0,
    audioTracks: 0,
    videoEnabled: false,
    audioEnabled: false,
  });
  const [remoteSoundLevel, setRemoteSoundLevel] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const dataConnectionRef = useRef<DataConnection | null>(null);
  const mediaConnectionRef = useRef<MediaConnection | null>(null);
  const connectionPollingRef = useRef<NodeJS.Timeout | null>(null);

  const userId = data.type === "doctor" ? data.doctor.id : data.patient.id;
  const userName =
    data.type === "doctor" ? data.doctor.name : data.patient.name;
  const appointmentId = data.appointmentId;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (remoteStream) {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(() => {});
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        const playPromise = remoteAudioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {}).catch(() => {});
        }
      }
    }
  }, [remoteStream]);

  const stopSoundDetection = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setSoundLevel(0);
  };

  useEffect(() => {
    if (!hasJoined) return;

    const captureMediaForced = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        localStreamRef.current = stream;
        setLocalStreamReady(true);

        stream.getVideoTracks().forEach((track) => {
          track.enabled = cameraOn;
        });
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch (error) {
        setConnectionError(
          `Failed to start media: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    };

    captureMediaForced();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasJoined]);

  // Original media capture effect (still run normal effect for cameraOn toggling)
  useEffect(() => {
    const videoElement = videoRef.current;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!cameraOn && localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      return;
    }

    if (cameraOn && localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
      return;
    }

    if (!cameraOn) {
      return;
    }

    if (cameraOn && !localStreamRef.current) {
      const mediaPromise = navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      timeoutId = setTimeout(() => {
        console.error(
          "❌ [TIMEOUT] getUserMedia promise hanging - no response after 10 seconds"
        );
      }, 10000);

      mediaPromise
        .then((stream) => {
          clearTimeout(timeoutId);
          localStreamRef.current = stream;
          setLocalStreamReady(true);
          if (videoElement) {
            videoElement.srcObject = stream;
          }

          setTimeout(() => {
            try {
              const audioContext = new (window.AudioContext ||
                // @ts-expect-error - webkit support
                window.webkitAudioContext)();
              const analyser = audioContext.createAnalyser();
              const source = audioContext.createMediaStreamSource(stream);
              source.connect(analyser);
              analyser.fftSize = 256;

              audioContextRef.current = audioContext;
              analyserRef.current = analyser;

              const detectSound = () => {
                if (analyserRef.current && !isMuted) {
                  const dataArray = new Uint8Array(
                    analyserRef.current.frequencyBinCount
                  );
                  analyserRef.current.getByteFrequencyData(dataArray);
                  const average =
                    dataArray.reduce((a, b) => a + b) / dataArray.length;
                  setSoundLevel(Math.min(100, (average / 255) * 150));
                } else {
                  setSoundLevel(0);
                }
                animationFrameRef.current = requestAnimationFrame(detectSound);
              };
              detectSound();
            } catch (error) {
              console.warn(
                "⚠️ Sound detection setup failed (non-critical):",
                error
              );
            }
          }, 0);
        })
        .catch((error) => {
          if (timeoutId !== undefined) clearTimeout(timeoutId);
          setConnectionError(
            `Cannot access camera/microphone: ${error.message}`
          );
        });
    }

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [cameraOn, isMuted]);

  // Setup peer connection and register with backend
  useEffect(() => {
    if (!hasJoined) return;

    const pollForOtherUser = (myPeerId: string) => {
      let hasInitiatedConnection = false;
      let pollCount = 0;

      const resetInterval = setInterval(() => {
        if (hasInitiatedConnection && !mediaConnectionRef.current) {
          hasInitiatedConnection = false;
        }
      }, 30000);

      connectionPollingRef.current = setInterval(async () => {
        pollCount++;
        try {
          const status = await getConnectionStatus(appointmentId);
          if (status) {
            setDoctorJoined(status.doctorConnected);
            setPatientJoined(status.patientConnected);

            if (
              status.bothConnected &&
              !mediaConnectionRef.current &&
              !hasInitiatedConnection
            ) {
              if (
                !localStreamRef.current ||
                localStreamRef.current.getTracks().length === 0
              ) {
                console.warn(
                  "⚠️ Both connected but local stream not ready yet, retrying..."
                );
                hasInitiatedConnection = false;
                return;
              }
              hasInitiatedConnection = true;
              const otherPeerId = await getOtherUserPeerId(
                appointmentId,
                data.type
              );

              if (otherPeerId && otherPeerId !== myPeerId) {
                initiateCall(otherPeerId);
                initiateDataConnection(otherPeerId);
              } else {
                console.warn(
                  "⚠️ Invalid peer ID:",
                  otherPeerId,
                  "myPeerId:",
                  myPeerId
                );
                hasInitiatedConnection = false;
              }
            }
          }
        } catch (error) {
          console.error("Error polling connection status:", error);
        }
      }, 1000);
    };

    const setupPeer = async () => {
      try {
        const uniquePeerId = `peer-${data.type}-${userId}-${Date.now()}`;
        const myPeer = new Peer(uniquePeerId, {
          host: "localhost",
          port: 5050,
          path: "/video-server",
        });

        myPeer.on("open", async (id) => {
          setPeerId(id);
          try {
            await registerPeer(id, userId, data.type, appointmentId);
          } catch (error) {
            console.error("Failed to register peer with backend:", error);
          }
          pollForOtherUser(id);
        });

        myPeer.on("call", (call) => {
          // Guard: prevent multiple handlers on same call
          if (
            mediaConnectionRef.current &&
            mediaConnectionRef.current.peer === call.peer
          ) {
            call.close();
            return;
          }
          if (
            !localStreamRef.current ||
            localStreamRef.current.getTracks().length === 0
          ) {
            setTimeout(() => {
              if (
                localStreamRef.current &&
                localStreamRef.current.getTracks().length > 0
              ) {
                try {
                  call.answer(localStreamRef.current);
                  mediaConnectionRef.current = call;
                } catch (error) {
                  call.close();
                }
              } else {
                call.close();
              }
            }, 2000);
            return;
          }

          try {
            call.on("stream", (remoteStream) => {
              const vTracks = remoteStream.getVideoTracks();
              const aTracks = remoteStream.getAudioTracks();
              // vTracks.forEach((track, i) => {
              //   console.info(
              //     `    Video ${i}: ${track.label} (enabled: ${track.enabled})`
              //   );
              // });
              // aTracks.forEach((track, i) => {
              //   console.info(
              //     `    Audio ${i}: ${track.label} (enabled: ${track.enabled})`
              //   );
              // });

              // console.info(
              //   "🔄 [STATE UPDATE] Calling setRemoteStream with stream:",
              //   remoteStream
              // );
              setRemoteStream(remoteStream);

              setRemoteStreamStats({
                videoTracks: vTracks.length,
                audioTracks: aTracks.length,
                videoEnabled: vTracks.some((t) => t.enabled),
                audioEnabled: aTracks.some((t) => t.enabled),
              });

              try {
                const audioContext = new (window.AudioContext ||
                  // @ts-expect-error webkit
                  window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const source =
                  audioContext.createMediaStreamSource(remoteStream);
                source.connect(analyser);
                analyser.fftSize = 256;

                const detectRemoteSound = () => {
                  if (analyser && remoteStream) {
                    const dataArray = new Uint8Array(
                      analyser.frequencyBinCount
                    );
                    analyser.getByteFrequencyData(dataArray);
                    const average =
                      dataArray.reduce((a, b) => a + b) / dataArray.length;
                    setRemoteSoundLevel(Math.min(100, (average / 255) * 150));
                    requestAnimationFrame(detectRemoteSound);
                  }
                };
                detectRemoteSound();
              } catch (error) {
                console.warn(
                  "⚠️ Remote audio analysis failed (non-critical):",
                  error
                );
              }
            });

            call.on("error", (error) => {
              setConnectionError(`Incoming call error: ${error}`);
            });

            call.on("close", () => {
              setRemoteStream(null);
            });

            // NOW answer the call AFTER all handlers are registered

            call.answer(localStreamRef.current);
            mediaConnectionRef.current = call;
          } catch (error) {
            setConnectionError(`Failed to answer call: ${error}`);
          }
        });

        myPeer.on("connection", (conn) => {
          // Receive data connection

          dataConnectionRef.current = conn;

          conn.on("open", () => {});

          conn.on("data", (data) => {
            // Receive chat message
            const message = data as {
              sender: string;
              text: string;
              timestamp: string;
            };
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                sender: message.sender,
                text: message.text,
                timestamp: new Date(message.timestamp),
              },
            ]);
          });

          conn.on("error", (error) => {});

          conn.on("close", () => {
            dataConnectionRef.current = null;
          });
        });

        myPeer.on("error", (error) => {
          setConnectionError(error.type || "Connection error");
        });

        peerRef.current = myPeer;
      } catch (error) {
        setConnectionError("Failed to setup peer connection");
      }
    };

    setupPeer();

    return () => {
      if (connectionPollingRef.current) {
        clearInterval(connectionPollingRef.current);
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasJoined, data.type, userId, appointmentId]);

  const initiateCall = (otherPeerId: string) => {
    if (!peerRef.current) {
      setConnectionError("Peer connection not initialized");
      return;
    }

    if (!localStreamRef.current) {
      setConnectionError("Local stream not available");
      return;
    }

    const hasActiveTracks = localStreamRef.current.getTracks().length > 0;
    if (!hasActiveTracks) {
      setConnectionError("Local stream has no active tracks");
      return;
    }

    const call = peerRef.current.call(otherPeerId, localStreamRef.current);

    const callTimeout = setTimeout(() => {
      if (!remoteStream) {
        setConnectionError("Connection timeout - remote stream not received");
      }
    }, 10000);

    // Register stream handler IMMEDIATELY

    call.on("stream", (remoteStream) => {
      clearTimeout(callTimeout);
      clearTimeout(callTimeout);

      const vTracks = remoteStream.getVideoTracks();
      const aTracks = remoteStream.getAudioTracks();

      // vTracks.forEach((track, i) => {
      //   console.info(
      //     `    Video ${i}: ${track.label} (enabled: ${track.enabled})`
      //   );
      // });
      // aTracks.forEach((track, i) => {
      //   console.info(
      //     `    Audio ${i}: ${track.label} (enabled: ${track.enabled})`
      //   );
      // });
      setRemoteStream(remoteStream);

      setRemoteStreamStats({
        videoTracks: vTracks.length,
        audioTracks: aTracks.length,
        videoEnabled: vTracks.some((t) => t.enabled),
        audioEnabled: aTracks.some((t) => t.enabled),
      });

      try {
        const audioContext = new (window.AudioContext ||
          // @ts-expect-error webkit
          window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(remoteStream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const detectRemoteSound = () => {
          if (analyser && remoteStream) {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average =
              dataArray.reduce((a, b) => a + b) / dataArray.length;
            setRemoteSoundLevel(Math.min(100, (average / 255) * 150));
            requestAnimationFrame(detectRemoteSound);
          }
        };
        detectRemoteSound();
      } catch (error) {}
    });

    call.on("error", (error) => {
      clearTimeout(callTimeout);

      setConnectionError(`Call failed: ${error}`);
    });

    call.on("close", () => {
      clearTimeout(callTimeout);

      setRemoteStream(null);
    });

    mediaConnectionRef.current = call;
  };

  const initiateDataConnection = (otherPeerId: string) => {
    if (!peerRef.current) return;

    const conn = peerRef.current.connect(otherPeerId);

    conn.on("open", () => {
      dataConnectionRef.current = conn;
    });

    conn.on("data", (data) => {
      // Receive chat message
      const message = data as {
        sender: string;
        text: string;
        timestamp: string;
      };
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: message.sender,
          text: message.text,
          timestamp: new Date(message.timestamp),
        },
      ]);
    });

    conn.on("error", (error) => {});

    conn.on("close", () => {
      dataConnectionRef.current = null;
    });
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !newMutedState;
      });
    } else {
    }
  };

  const handleCameraToggle = () => {
    const newCameraState = !cameraOn;
    setCameraOn(newCameraState);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = newCameraState;
      });
    }
  };

  const handleEndMeeting = async () => {
    if (peerId) {
      await removePeer(peerId);
    }

    if (connectionPollingRef.current) {
      clearInterval(connectionPollingRef.current);
    }

    if (dataConnectionRef.current) {
      dataConnectionRef.current.close();
    }

    if (mediaConnectionRef.current) {
      mediaConnectionRef.current.close();
    }

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    stopSoundDetection();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    setLocalStreamReady(false);
    setInMeeting(false);
    setHasJoined(false);
    setRemoteStream(null);
  };

  const handleJoinMeeting = () => {
    setHasJoined(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: messageInput,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);

    if (dataConnectionRef.current && dataConnectionRef.current.open) {
      dataConnectionRef.current.send({
        sender: userName,
        text: messageInput,
        timestamp: new Date().toISOString(),
      });
    }

    setMessageInput("");
  };

  useEffect(() => {
    if (hasJoined && !inMeeting) {
      setInMeeting(true);
    }
  }, [hasJoined, inMeeting]);

  if (!hasJoined) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a1628] via-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src="/assets/logoimglogo.png"
                alt="MediSync Logo"
                width={64}
                height={64}
                className="rounded-2xl object-contain"
              />
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#0077B6] to-[#005f8c] bg-clip-text text-transparent">
                  MediSync
                </h1>
                <p className="text-gray-300 text-sm mt-1">Healthcare Meeting</p>
              </div>
            </div>
            <p className="text-gray-300 text-xl">
              Ready to join your consultation?
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-2 gap-8 p-8">
              {/* Left Side - Video Preview */}
              <div className="flex flex-col justify-center">
                <div className="relative">
                  {/* Video Preview */}
                  <div className="rounded-2xl overflow-hidden bg-black shadow-lg mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full aspect-video object-cover transform -scale-x-100"
                    />

                    {!cameraOn && (
                      <div className="absolute inset-0 bg-black flex items-center justify-center">
                        <div className="text-center">
                          <VideoOff
                            size={48}
                            className="text-gray-500 mx-auto mb-3"
                          />
                          <p className="text-gray-400">Camera Off</p>
                        </div>
                      </div>
                    )}

                    {/* Sound Indicator - Animated Bars */}
                    <div className="absolute bottom-3 left-3 flex items-end gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all duration-75 ${
                            soundLevel > i * 20
                              ? "bg-green-500 shadow-lg shadow-green-500/50"
                              : "bg-gray-600"
                          }`}
                          style={{
                            width: "4px",
                            height: `${8 + i * 4}px`,
                          }}
                        ></div>
                      ))}
                    </div>

                    {/* Mute Indicator Badge */}
                    {isMuted && (
                      <div className="absolute top-3 right-3 bg-red-500/90 rounded-full p-2.5 backdrop-blur-md">
                        <MicOff size={18} className="text-white" />
                      </div>
                    )}
                  </div>

                  <p className="text-gray-300 text-center text-sm mb-2">
                    Your Preview
                  </p>

                  {/* Local Stream Diagnostics */}
                  {inMeeting && (
                    <div className="bg-black/60 backdrop-blur rounded-lg px-2 py-1.5 text-xs text-white border border-blue-500/30">
                      <p className="font-semibold mb-0.5">📤 You:</p>
                      <div className="space-y-0.5 font-mono text-xs">
                        <p>
                          🎥{" "}
                          {localStreamStats.videoTracks > 0 ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-red-400">✗</span>
                          )}
                        </p>
                        <p>
                          🎤{" "}
                          {localStreamStats.audioTracks > 0 ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-red-400">✗</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Settings & Join Button */}
              <div className="flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Settings Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Prepare for Meeting
                    </h2>
                  </div>

                  {/* Video Setting */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        {cameraOn ? (
                          <Video size={24} className="text-[#0077B6]" />
                        ) : (
                          <VideoOff size={24} className="text-red-500" />
                        )}
                        <div>
                          <p className="text-white font-semibold">Camera</p>
                          <p className="text-xs text-gray-400">
                            {cameraOn ? "On" : "Off"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCameraToggle}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          cameraOn
                            ? "bg-[#0077B6] text-white hover:bg-[#005f8c]"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }`}
                      >
                        {cameraOn ? "On" : "Off"}
                      </button>
                    </div>
                  </div>

                  {/* Audio Setting */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        {isMuted ? (
                          <MicOff size={24} className="text-red-500" />
                        ) : (
                          <Mic size={24} className="text-[#0077B6]" />
                        )}
                        <div>
                          <p className="text-white font-semibold">Microphone</p>
                          <p className="text-xs text-gray-400">
                            {isMuted ? "Muted" : "Active"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleMuteToggle}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          isMuted
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-[#0077B6] text-white hover:bg-[#005f8c]"
                        }`}
                      >
                        {isMuted ? "Muted" : "Active"}
                      </button>
                    </div>
                  </div>

                  {/* Meeting Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Meeting ID</p>
                    <p className="text-white font-mono font-semibold break-all">
                      {peerId ? peerId : "Generating..."}
                    </p>
                  </div>

                  {/* Error Display */}
                  {connectionError && (
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                      <p className="text-red-200 text-sm">{connectionError}</p>
                    </div>
                  )}
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-gradient-to-r from-[#0077B6] to-[#005f8c] hover:shadow-2xl hover:shadow-[#0077B6]/50 text-white font-bold py-4 rounded-xl transition-all duration-200 transform hover:scale-105 mt-6"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Join Meeting</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>
              Make sure your camera and microphone are working before joining
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!inMeeting) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a1628] via-[#1a3a52] to-[#2d5a7b] flex flex-col items-center justify-center p-6">
        <div className="text-center">
          {/* Animated Logo */}
          <div className="mb-8">
            <Image
              src="/assets/logoimglogo.png"
              alt="MediSync Logo"
              width={96}
              height={96}
              className="rounded-2xl object-contain mx-auto animate-pulse"
            />
          </div>

          {/* Text */}
          <h1 className="text-4xl font-bold text-white mb-3">MediSync</h1>
          <p className="text-xl text-gray-300 mb-8">
            Connecting to your meeting...
          </p>

          {/* Loading Animation */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-[#0077B6] rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Status Text */}
          <p className="text-gray-400 text-sm">
            {data.type === "patient"
              ? doctorJoined
                ? "Doctor is here! Starting connection..."
                : "Waiting for doctor to join..."
              : patientJoined
              ? "Patient is here! Starting connection..."
              : "Waiting for patient to join..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex overflow-hidden">
      {/* ==================== DEBUG PANEL ====================*/}
      <div className="fixed top-4 left-4 z-50 bg-gray-900/90 border border-gray-700 rounded-lg p-3 text-xs text-white max-w-xs">
        <div className="font-bold mb-2 text-yellow-400">🔧 Debug State</div>
        <div className="space-y-1 font-mono text-gray-300">
          <div>
            📸 cameraOn:{" "}
            <span className={cameraOn ? "text-green-400" : "text-red-400"}>
              {String(cameraOn)}
            </span>
          </div>
          <div>
            🎙️ isMuted:{" "}
            <span className={isMuted ? "text-red-400" : "text-green-400"}>
              {String(isMuted)}
            </span>
          </div>
          <div>
            📡 localStream:{" "}
            <span
              className={
                localStreamRef.current ? "text-green-400" : "text-red-400"
              }
            >
              {localStreamRef.current ? "✓" : "✗"}
            </span>
          </div>
          <div>
            🎬 streamReady:{" "}
            <span
              className={localStreamReady ? "text-green-400" : "text-red-400"}
            >
              {String(localStreamReady)}
            </span>
          </div>
          <div>
            🎥 tracks:{" "}
            <span>{localStreamRef.current?.getTracks().length ?? 0}</span>
          </div>
          <div>
            👥 bothConnected:{" "}
            <span
              className={
                doctorJoined && patientJoined
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {doctorJoined && patientJoined ? "✓" : "✗"}
            </span>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ====================*/}
      <div className="flex-1 flex overflow-hidden gap-3 p-3">
        {/* LEFT SIDE - Main Video Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden relative">
          {remoteStream ? (
            // Remote video
            <div className="w-full h-full bg-black flex items-center justify-center relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                muted
                playsInline
                controls={false}
                className="w-full h-full object-cover"
                style={{ backgroundColor: "black" }}
              />
              <audio
                ref={remoteAudioRef}
                autoPlay
                playsInline
                controls={false}
              />
            </div>
          ) : data.type === "patient" && !doctorJoined ? (
            // Waiting for Doctor State
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077B6] to-[#005f8c] rounded-full animate-pulse blur-lg opacity-75"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-[#0077B6] to-[#005f8c] rounded-full flex items-center justify-center">
                  <span className="text-6xl">👨‍⚕️</span>
                </div>
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Waiting for Doctor
                </h2>
                <p className="text-gray-300 text-lg mb-4">
                  The doctor will join your meeting soon. Please be patient.
                </p>
                <div className="bg-gray-800 rounded-lg px-4 py-2 inline-block">
                  <p className="text-xs text-gray-400">Your Meeting ID</p>
                  <p className="text-sm font-mono text-[#0077B6] font-semibold">
                    {peerId?.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          ) : data.type === "doctor" && !patientJoined ? (
            // Doctor waiting for patient
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0077B6] to-[#005f8c] rounded-full animate-pulse blur-lg opacity-75"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-[#0077B6] to-[#005f8c] rounded-full flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                </div>
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Waiting for Patient
                </h2>
                <p className="text-gray-300 text-lg mb-4">
                  Waiting for the patient to join the meeting.
                </p>
                <div className="bg-gray-800 rounded-lg px-4 py-2 inline-block">
                  <p className="text-xs text-gray-400">Your Meeting ID</p>
                  <p className="text-sm font-mono text-[#0077B6] font-semibold">
                    {peerId?.substring(0, 12)}...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Both connected but no video yet
            <div className="text-center">
              <div className="w-48 h-48 bg-gradient-to-br from-[#0077B6]/20 to-[#005f8c]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#0077B6]/30 animate-pulse">
                <span className="text-7xl">
                  {data.type === "doctor" ? "👤" : "👨‍⚕️"}
                </span>
              </div>
              <p className="text-2xl text-gray-300 font-semibold">
                Establishing connection...
              </p>
            </div>
          )}

          {/* ==================== OVERLAY: HEADER (Top-Left) ====================*/}
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logoimglogo.png"
                alt="MediSync Logo"
                width={48}
                height={48}
                className="rounded-lg object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white leading-none">
                  MediSync
                </h1>
                <p className="text-xs text-gray-300">Healthcare Meeting</p>
              </div>
            </div>
          </div>

          {/* ==================== OVERLAY: STATUS (Top-Right) ====================*/}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
            <div
              className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                remoteStream
                  ? "bg-green-500 shadow-lg shadow-green-500/50"
                  : "bg-yellow-500 shadow-lg shadow-yellow-500/50"
              }`}
            ></div>
            <span className="text-xs font-semibold text-white">
              {data.type === "doctor"
                ? patientJoined
                  ? "Patient Connected"
                  : "Waiting for Patient..."
                : doctorJoined
                ? "Doctor Connected"
                : "Waiting for Doctor..."}
            </span>
          </div>

          {/* ==================== OVERLAY: STREAM DIAGNOSTICS (Top-Right, Below Status) ====================*/}
          {remoteStream && (
            <div className="absolute top-16 right-4 z-10 bg-black/70 backdrop-blur-md px-3 py-2 rounded-lg text-xs text-white border border-green-500/30">
              <p className="font-semibold mb-1">📡 Stream Status:</p>
              <div className="space-y-0.5 font-mono text-xs">
                <p>
                  🎥 Video:{" "}
                  {remoteStreamStats.videoTracks > 0 ? (
                    <span className="text-green-400">
                      ✓ {remoteStreamStats.videoTracks}
                    </span>
                  ) : (
                    <span className="text-red-400">✗ 0</span>
                  )}
                </p>
                <p>
                  🎤 Audio:{" "}
                  {remoteStreamStats.audioTracks > 0 ? (
                    <span className="text-green-400">
                      ✓ {remoteStreamStats.audioTracks}
                    </span>
                  ) : (
                    <span className="text-red-400">✗ 0</span>
                  )}
                </p>
                {remoteStreamStats.audioTracks > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span>🔊</span>
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-2 rounded-xs transition-all ${
                          remoteSoundLevel > i * 16.67
                            ? "bg-green-500"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== OVERLAY: CONTROLS (Bottom-Center) ====================*/}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-6 items-center bg-black/50 backdrop-blur-lg rounded-2xl px-8 py-4 shadow-2xl border border-white/10">
            {/* Mute Button */}
            <div className="flex flex-col items-center">
              <Button
                onClick={handleMuteToggle}
                className={`rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl ${
                  isMuted
                    ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/50"
                    : "bg-gradient-to-br from-[#0077B6] to-[#005f8c] hover:from-[#005f8c] hover:to-[#004a6b] text-white hover:shadow-blue-500/50"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <MicOff size={40} /> : <Mic size={40} />}
              </Button>
              <span className="text-xs text-gray-300 mt-2 font-semibold">
                {isMuted ? "Muted" : "Audio On"}
              </span>
            </div>

            {/* Camera Button */}
            <div className="flex flex-col items-center">
              <Button
                onClick={handleCameraToggle}
                className={`rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl ${
                  cameraOn
                    ? "bg-gradient-to-br from-[#0077B6] to-[#005f8c] hover:from-[#005f8c] hover:to-[#004a6b] text-white hover:shadow-blue-500/50"
                    : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/50"
                }`}
                title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
              >
                {cameraOn ? <Video size={40} /> : <VideoOff size={40} />}
              </Button>
              <span className="text-xs text-gray-300 mt-2 font-semibold">
                {cameraOn ? "Camera On" : "Camera Off"}
              </span>
            </div>

            {/* End Call Button */}
            <div className="flex flex-col items-center">
              <Button
                onClick={handleEndMeeting}
                className="rounded-xl w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-red-500/50"
                title="End Meeting"
              >
                <PhoneOff size={40} />
              </Button>
              <span className="text-xs text-red-300 mt-2 font-semibold">
                End Call
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Chat & Preview (Split) */}
        <div className="w-96 flex flex-col gap-3 min-w-0">
          {/* ==================== CHAT SECTION ====================*/}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 min-h-0">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#0077B6] via-[#005f8c] to-[#0077B6] text-white p-5 flex items-center gap-3 shadow-md">
              <div className="bg-white/20 rounded-lg p-2">
                <MessageCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Live Chat</h3>
                <p className="text-xs text-white/70">
                  {remoteStream ? "Connected" : "Waiting for connection..."}
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle
                      size={48}
                      className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm font-medium">No messages yet</p>
                    <p className="text-xs">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "You" ? "justify-end" : "justify-start"
                    } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-3 shadow-md ${
                        msg.sender === "You"
                          ? "bg-gradient-to-br from-[#0077B6] to-[#005f8c] text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.text}</p>
                      <p
                        className={`text-xs mt-1.5 ${
                          msg.sender === "You"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
              <Input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                disabled={!remoteStream}
                className="flex-1 text-sm rounded-full border-2 border-gray-200 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] px-4 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!remoteStream}
                className="bg-gradient-to-r from-[#0077B6] to-[#005f8c] hover:shadow-lg text-white rounded-full px-6 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </Button>
            </div>
          </div>

          {/* ==================== VIDEO PREVIEW SECTION ====================*/}
          <div className="h-56 flex flex-col bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0077B6]/20 rounded-lg flex items-center justify-center">
                  <Video size={18} className="text-[#0077B6]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Your Preview</h4>
                  <p className="text-xs text-gray-400">Self View</p>
                </div>
              </div>

              {/* Activity Indicators */}
              <div className="flex gap-2 items-center">
                {isMuted && (
                  <div className="bg-red-500/90 rounded-lg px-2.5 py-1.5 backdrop-blur-md flex items-center gap-1.5">
                    <MicOff size={14} className="text-white" />
                    <span className="text-xs text-white font-semibold">
                      Muted
                    </span>
                  </div>
                )}
                {!cameraOn && (
                  <div className="bg-orange-500/90 rounded-lg px-2.5 py-1.5 backdrop-blur-md flex items-center gap-1.5">
                    <VideoOff size={14} className="text-white" />
                    <span className="text-xs text-white font-semibold">
                      Off
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview */}
            <div className="flex-1 bg-black overflow-hidden relative group">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {!cameraOn && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <VideoOff size={32} className="text-red-400" />
                    </div>
                    <p className="text-white text-sm font-semibold">
                      Camera Off
                    </p>
                  </div>
                </div>
              )}

              {/* Sound Indicator - Bottom Left */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                {/* Mic Icon with Green Glow when Speaking */}
                <div className="relative">
                  {soundLevel > 0 && !isMuted && (
                    <>
                      <div className="absolute inset-0 bg-green-500 rounded-lg blur-md opacity-60 animate-pulse"></div>
                      <div className="absolute inset-0 bg-green-500/30 rounded-lg border-2 border-green-500 animate-pulse"></div>
                    </>
                  )}
                  <div
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${
                      soundLevel > 0 && !isMuted
                        ? "bg-green-500 text-white"
                        : isMuted
                        ? "bg-red-500 text-white"
                        : "bg-blue-500/80 text-white"
                    }`}
                  >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
