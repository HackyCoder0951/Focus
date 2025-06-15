import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import React, { useEffect, useRef, useState } from "react";
import { Comment, Divider, Grid, Header, Segment } from "semantic-ui-react";
import io from "socket.io-client";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { NoMessages } from "../components/Layout/NoData";
import Banner from "../components/Messages/Banner";
import Message from "../components/Messages/Message";
import MessageInputField from "../components/Messages/MessageInputField";
import baseUrl from "../utils/baseUrl";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behaviour: "smooth" });

function Messages({ chatsData, user }) {
  const router = useRouter();
  const [chats, setChats] = useState(chatsData || []);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);
  const [sendMsgLoading, setSendMsgLoading] = useState(false);
  const [showToastr, setShowToastr] = useState(false);

  const socket = useRef();
  const openChatId = useRef();
  const messagesEndRef = useRef();

  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });

  const divRef = useRef();

  useEffect(() => {
    if (router.query.message) {
      openChatId.current = router.query.message;
    }
  }, [router.query.message]);

  useEffect(() => {
    const messageRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/chats`,
          {},
          { headers: { Authorization: cookie.get("token") } }
        );
      } catch (error) {
        console.log(error);
      }
    };

    messageRead();
  }, []);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("connectedUsers", ({ users }) => {
        setConnectedUsers(users);
      });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        if (openChatId.current === newMsg.sender || openChatId.current === newMsg.receiver) {
          setMessages((prev) => [...prev, newMsg]);
        }
        
        setChats((prev) => {
          const previousChat = prev.find(
            (chat) => chat.messagesWith === newMsg.sender || chat.messagesWith === newMsg.receiver
          );
          if (previousChat) {
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;
            const updatedChats = prev.filter(chat => chat.messagesWith !== previousChat.messagesWith);
            return [previousChat, ...updatedChats];
          }
          return prev;
        });

        setTimeout(() => scrollDivToBottom(divRef), 100);

        if (newMsg.sender !== user._id) {
          const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
          newMsgSound(name);
        }
      });

      socket.current.on("msgSent", ({ newMsg }) => {
        setMessages((prev) => [...prev, newMsg]);
        setChats((prev) => {
          const previousChat = prev.find(
            (chat) => chat.messagesWith === newMsg.receiver
          );
          if (previousChat) {
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;
          }
          return [...prev];
        });
        setTimeout(() => scrollDivToBottom(divRef), 100);
      });

      socket.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.current.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
        socket.current.emit("join", { userId: user._id });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off();
      }
    };
  }, []);

  // LOAD MESSAGES useEffect
  useEffect(() => {
    const loadMessages = () => {
      if (socket.current && openChatId.current) {
        setMessages([]);
        socket.current.emit("loadMessages", {
          userId: user._id,
          messagesWith: openChatId.current,
        });

        socket.current.on("messagesLoaded", async ({ chat }) => {
          setMessages(chat.messages);
          setBannerData({
            name: chat.messagesWith.name,
            profilePicUrl: chat.messagesWith.profilePicUrl,
          });

          openChatId.current = chat.messagesWith._id;
          divRef.current && scrollDivToBottom(divRef);
        });

        socket.current.on("noChatFound", async () => {
          const { name, profilePicUrl } = await getUserInfo(openChatId.current);

          setBannerData({ name, profilePicUrl });
          setMessages([]);

          openChatId.current = openChatId.current;
        });
      }
    };

    loadMessages();
  }, [openChatId.current]);

  const sendMsg = (msg) => {
    if (socket.current && msg.trim() && openChatId.current) {
      setSendMsgLoading(true);
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
      setSendMsgLoading(false);
    }
  };

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit("deleteMsg", {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });

      socket.current.on("msgDeleted", () => {
        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
    }
  };

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: { Authorization: cookie.get("token") },
      });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      openChatId.current = null;
    } catch (error) {
      alert("Error deleting chat");
    }
  };

  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: "5px" }}>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => {
            openChatId.current = null;
            router.push('/messages', undefined, { shallow: true });
          }}
          style={{ cursor: "pointer" }}
        />
        <Divider hidden />

        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>

        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: "auto", maxHeight: "32rem" }}
                  >
                    {chats.map((chat, i) => (
                      <Chat
                        key={i}
                        chat={chat}
                        connectedUsers={connectedUsers}
                        deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>

              <Grid.Column width={12}>
                {openChatId.current && (
                  <>
                    <div
                      style={{
                        overflow: "auto",
                        overflowX: "hidden",
                        maxHeight: "35rem",
                        height: "35rem",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <div style={{ position: "sticky", top: "0" }}>
                        <Banner bannerData={bannerData} />
                      </div>

                      {messages.length > 0 &&
                        messages.map((message, i) => (
                          <Message
                            divRef={divRef}
                            key={i}
                            bannerProfilePic={bannerData.profilePicUrl}
                            message={message}
                            user={user}
                            deleteMsg={deleteMsg}
                          />
                        ))}
                    </div>

                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token },
    });

    return { chatsData: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default Messages;
