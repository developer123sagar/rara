/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store";
import { useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/store";
import { fetchIndvRestInfo } from "@/redux/restaurant/restaurantSlice";
import { IoSendSharp } from "react-icons/io5";
import { connectSocket } from "@/common/global/socket";
import { Socket } from "socket.io-client";
import { url } from "@/routes";
import { fetchRestAdminId } from "@/redux/restaurant/restaurantSlice";
import { baseImgUrl } from "@/routes";
import { format } from "timeago.js";
import { useRef } from "react";

/* Yo chain dashboard wala */

import axios from "axios";
import "../../../../src/common/chat/chat.css";

const Chat = () => {
  const [restaurantChattedUsers, setRestaurantChattedUsers] = useState<
    Array<string>
  >([]);
  const [newMessageAppeared, setNewMessageAppeared] = useState(false);
  const [recievedMessages, setRecievedMessages] = useState<Array<any>>([]);
  const [indvChat, setIndvChat] = useState<any>([]);
  const scroll: any = useRef();
  const [currentUser, setCurrentUser] = useState<any>(null); 
  const [sock, setSocket] = useState<Socket>();
  const [audio] = useState(new Audio("/audio/chatAayo.mp3"));
  const [message, setMessage] = useState("");

  const dispatch = useAppDispatch();
  const { restAdminId } = useAppSelector(
    (state: RootState) => state.restaurant
  );

  useEffect(() => {
    dispatch(fetchRestAdminId(token));
  }, [dispatch]);

  const token = useAppSelector((state: RootState) => state.signin.token);

  const playAudioAndShow = () => {
    audio.play();
    setNewMessageAppeared(true);
  };

  useEffect(() => {
    setSocket(connectSocket(token));
  }, [setSocket, connectSocket]);

  console.log(currentUser)

  useEffect(() => {
    sock &&
      sock.on("CHATTING", (arg) => {
        console.log(arg)
        if (currentUser) {
          if (currentUser.members[0]) {
            if (arg.senderId === currentUser.members[0]._id) {
              const body = {
                content: arg.message,
                senderId: arg.senderId,
              };
              setIndvChat((prevMessages: any) => [...prevMessages, body]);
            } else {
              playAudioAndShow();
              setRecievedMessages((prevMessages: any) => [
                ...prevMessages,
                arg.senderId,
              ]);
            }
          } else {
            playAudioAndShow();
            setRecievedMessages((prevMessages: any) => [
              ...prevMessages,
              arg.senderId,
            ]);
          }
        } else {
          playAudioAndShow();
          setRecievedMessages((prevMessages: any) => [
            ...prevMessages,
            arg.senderId,
          ]);
        }
      });
  }, [currentUser, sock]);

  useEffect(() => {
    const getUserChatData = async (id: string | null) => {
      try {
        const res = await axios.get(`${url}/rarachat/${id}`);
        setRestaurantChattedUsers(res.data.Data);
        return res.data;
      } catch (err) {
        const customError = new Error(
          "An error occurred: " + (err as Error).message
        ) as Error;
        throw customError;
      }
    };
    if (restAdminId && restAdminId._id) getUserChatData(restAdminId._id);
  }, [restAdminId]);

  const sendMessage = async () => {
    if (restAdminId && restAdminId._id) {
      const messageBody = {
        receiveId: currentUser.members[0]._id,
        message: message,
        senderId: restAdminId._id,
      };

      sock && sock.emit("CHATTING", messageBody);
      setMessage("");
      const body = {
        chatId: currentUser.chatId,
        senderId: restAdminId._id,
        content: message,
      };
      try {
        await axios.post(`${url}/raramessage`, body);
      } catch (err) {
        throw err;
      }
    }

    const data: any = [...indvChat];
    data.push({
      chatId: currentUser.chatId,
      content: message,
      senderId: restAdminId._id,
    });
    setIndvChat(data);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    const fetchIndvChat = async (chatId: string | null) => {
      try {
        const res = await axios.get(`${url}/raramessage/${chatId}`);
        setIndvChat(res.data);
        return res.data;
      } catch (err) {
        const customError = new Error(
          "An error occurred: " + (err as Error).message
        ) as Error;
        throw customError;
      }
    };

    if (currentUser) fetchIndvChat(currentUser.chatId);
  }, [currentUser]);

  useEffect(() => {
    recievedMessages.length === 0 && setNewMessageAppeared(false);
  }, [recievedMessages]);

  useEffect(() => {
    dispatch(fetchIndvRestInfo(token));
  }, [dispatch, token]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [indvChat]);

  return (
    <div>
      <div className="Chat">
        <div className="Left-side-chat">
          <div className="Chat-container">
            <h1 className="text-[20px] font-bold ">Chats</h1>
            <div className="Chat-list">
              {restaurantChattedUsers?.length > 0 &&
                restaurantChattedUsers?.map((ru: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => {
                      if (recievedMessages.includes(ru.members[0]._id)) {
                        const data = [...recievedMessages];
                        const filteredData = data.filter(
                          (content) => content !== ru.members[0]._id
                        );
                        setRecievedMessages(filteredData);
                      }
                      setCurrentUser(ru);
                    }}
                  >
                    <div className="follower conversation" key={i}>
                      {/* {ru.members[0] && ( */}
                      <div className="flex gap-3 relative items-center">
                        {/* {ru.members[0]?.photo ? ( */}
                        <img
                          src={
                            ru?.members[0]?.photo?.startsWith("https")
                              ? ru?.members[0]?.photo
                              : `${baseImgUrl}/${ru.members[0]?.photo}`
                          }
                          className="followerImage h-[30px] w-[30px] rounded-full object-cover"
                        />
                        {/* ) : (
                            <img
                              src="/img/defaultIcon.svg"
                              className="followerImage h-[50px] w-[50px] rounded-full"
                            />
                          )} */}
                        <div className="name" style={{ fontSize: "0.8rem" }}>
                          <span className="text-[20px] font-bold">
                            {" "}
                            {ru.members[0].name}
                          </span>
                        </div>
                        {newMessageAppeared &&
                          recievedMessages.includes(ru.members[0]._id) && (
                            <div className="absolute top-0 h-[15px] w-[15px] rounded-full bg-[#0a0a0a]" />
                          )}
                      </div>
                      {/* )} */}
                    </div>
                    <hr
                      className="w-[85%]"
                      style={{ border: "0.1px solid #ececec" }}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="Right-side-chat">
          <div className="ChatBox-container">
            {currentUser ? (
              <>
                <div className="chat-header">
                  <div className="follower">
                    {currentUser && (
                      <div className="flex gap-3 items-center">
                        {/* {currentUser.members[0].photo ? ( */}
                        <img
                          src={
                            currentUser?.members[0]?.photo?.startsWith("https")
                              ? currentUser?.members[0]?.photo
                              : `${baseImgUrl}/${currentUser?.members[0]?.photo}`
                          }
                          className="followerImage h-[30px] w-[30px] object-cover rounded-full"
                        />
                        {/* ) : (
                          <img
                            src="/img/defaultIcon.svg"
                            className="followerImage h-[50px] w-[50px] rounded-full"
                          />
                        )} */}
                        <div className="name" style={{ fontSize: "0.8rem" }}>
                          <span className="text-[20px] font-bold">
                            {" "}
                            {currentUser.members[0].name}{" "}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <hr
                    className="w-[85%] mt-5"
                    style={{ border: "0.1px solid #ececec" }}
                  />
                </div>
                <div className="chat-body ">
                  {indvChat?.reverse().map((chat: any, id: number) => (
                    <div
                      ref={scroll}
                      key={id}
                      className={`${
                        chat.senderId === restAdminId._id
                          ? "message own"
                          : "message"
                      } rounded-[10px] p-5 ml-5 mt-5`}
                    >
                      <span> {chat.content} </span>
                      <span> {format(chat.createdAt)} </span>
                    </div>
                  ))}
                </div>

                <div className="chat-sender relative">
                  <textarea
                    value={message}
                    className="w-full border-2 border-[rgb(230,230,230)] resize-none pl-[15px]"
                    placeholder="Enter your text"
                    onKeyDown={handleKeyPress}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <IoSendSharp
                    size={30}
                    className="absolute top-[15px] text-[#0a0a0a] right-[20px] cursor-pointer "
                    onClick={sendMessage}
                  />
                </div>
              </>
            ) : (
              <span className="chatbox-empty-message ">
                {" "}
                Select a chat to start conversation{" "}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
