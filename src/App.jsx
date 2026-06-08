import React, { useEffect, useState } from "react";
import { url } from "./constant";
import Answers from "./componenets/Answers";
import { useRef } from "react";

const App = () => {
  const [question, setquestion] = useState("");
  const [result, setresult] = useState([]);
  const [recenthistory, setrecenthistory] = useState(
    JSON.parse(localStorage.getItem("history")),
  );

  const [selecthistory, setselecthistory] = useState("");

  const scrolltoanswerpart = useRef();

  const [loader,setloader]= useState(false)

  const askquestion = async () => {
    try {
      if (!question && !selecthistory) {
        return false;
      }

      if (question) {
        if (localStorage.getItem("history")) {
          let history = JSON.parse(localStorage.getItem("history"));
          history = [question, ...history];
          localStorage.setItem("history", JSON.stringify(history));
          setrecenthistory(history);
        } else {
          localStorage.setItem("history", JSON.stringify([question]));
          setrecenthistory([question]);
        }
      }

      const payloaddata = question ? question : selecthistory;
      const payload = {
        contents: [
          {
            parts: [
              {
                text: payloaddata,
              },
            ],
          },
        ],
      };

      setloader(true);

      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "X-goog-api-key":
            import.meta.env.VITE_GEMINI_API_KEY,
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log(data);
      let datastring = data.candidates[0].content.parts[0].text;
      datastring = datastring.split("*");
      datastring = datastring.map((item) => item.trim());

      console.log(datastring);

      setresult([
        ...result,
        { type: "q", text: payloaddata },
        { type: "a", text: datastring },
      ]);
      setquestion("");

      setTimeout(() => {
        scrolltoanswerpart.current.scrollTop =
          scrolltoanswerpart.current.scrollHeight;
      }, 500);

      setloader(false);

    } catch (error) {
      console.log(error);
    }
  };
  // clear history fn
  const clearhistory = () => {
    localStorage.clear();
    setrecenthistory([]);
  };
  // enetr to search fn
  const isenter = (event) => {
    if (event.key == "Enter") {
      askquestion();
    }
  };
  // history show in chat area fn
  useEffect(() => {
    console.log(selecthistory);
    askquestion();
  }, [selecthistory]);

  return (
    <div className="grid grid-cols-5 h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-center">
      {/* Sidebar */}
      <div className="col-span-1 bg-white/5 backdrop-blur-xl border-r border-white/10  text-white text-2xl font-bold shadow-2xl pt-5">
        <h1 className="text-xl text-blue-200 flex justify-center  ">
          <span>RECENT SEARCH </span>

          <button
            onClick={clearhistory}
            className="fill-cyan-100 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl flex items-center justify-center shadow-lg hover:scale-110  active:scale-90 transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>
        <ul className="text-left overflow-auto text-sm">
          {recenthistory &&
            recenthistory.map((historyitem, index) => (
              <li
                key={index}
                onClick={() => {
                  setselecthistory(historyitem);
                }}
                className="p-1 truncate pl-5 text-zinc-500 cursor-pointer hover:bg-zinc-700 hover:text-zinc-300"
              >
                {historyitem}
              </li>
            ))}
        </ul>
      </div>

      {/* Main Section */}
      <div className="col-span-4 flex flex-col  h-screen overflow-hidden">
        {/* Header */}
        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mt-10 tracking-wide animate-pulse">
          USE SONAL'S AI BRAIN
        </div>

        {/* spinnerr or loader */}



             <div className="flex items-center justify-center">
               {
                loader? <div role="status">
      <svg xmlns="http://www.w3.org/2000/svg" class="size-17 shrink-0 animate-spin  fill-blue-400"
         viewBox="0 0 512 512" aria-hidden="true">
         <path
            d="M248.093 177.6c-43.214 0-78.4 35.186-78.4 78.4 0 43.245 35.186 78.4 78.4 78.4 43.246 0 78.4-35.155 78.4-78.4 0-43.214-35.154-78.4-78.4-78.4zm0 125.44c-25.934 0-47.04-21.105-47.04-47.04s21.106-47.04 47.04-47.04 47.04 21.105 47.04 47.04-21.105 47.04-47.04 47.04z"
            data-original="#000000" />
         <path
            d="m310.75 191.869-15.68-172.48c-.72-8.091-7.494-14.269-15.617-14.269h-62.72c-8.122 0-14.896 6.178-15.617 14.269l-15.68 172.48c-.408 4.39 1.066 8.718 4.046 11.98a15.627 15.627 0 0 0 11.571 5.111h94.08c4.422 0 8.593-1.85 11.572-5.08a15.667 15.667 0 0 0 4.046-12.011zM218.208 177.6l12.858-141.12h34.057l12.826 141.12h-59.74zm12.701 142.625-47.04-81.473c-2.226-3.795-5.927-6.523-10.223-7.464-4.297-.91-8.812-.031-12.419 2.51l-141.559 99.85c-6.617 4.64-8.593 13.61-4.547 20.634l31.36 54.316a15.76 15.76 0 0 0 13.61 7.84c2.227 0 4.453-.44 6.586-1.443l157.207-72.692a15.876 15.876 0 0 0 8.374-9.502c1.348-4.171.846-8.75-1.349-12.576zM66.488 380.5l-17.029-29.51 115.813-81.692 29.854 51.744-128.638 59.458zm410-46.852-141.527-99.819c-3.607-2.54-8.217-3.45-12.419-2.508a15.573 15.573 0 0 0-10.192 7.463l-47.04 81.474c-2.195 3.826-2.728 8.373-1.38 12.575 1.317 4.202 4.39 7.62 8.373 9.502l157.208 72.661a15.908 15.908 0 0 0 6.586 1.443 15.672 15.672 0 0 0 13.578-7.84l31.36-54.316c4.046-6.993 2.07-15.993-4.547-20.635zm-46.82 46.884L301.06 321.072l29.886-51.713 115.782 81.662-17.06 29.51z"
            data-original="#000000" />
         <path
            d="M494.928 211.406c-1.6-8.498-9.722-14.018-18.283-12.544-8.499 1.6-14.112 9.784-12.513 18.283 2.321 12.513 3.481 25.558 3.481 38.855 0 38.322-10.223 76.173-29.572 109.415-4.328 7.495-1.788 17.091 5.707 21.45 2.478 1.443 5.175 2.101 7.872 2.101 5.394 0 10.662-2.79 13.579-7.808 22.077-38.04 33.774-81.317 33.774-125.158 0-15.21-1.348-30.2-4.045-44.594zm-13.924-47.855c-4.077-10.663-9.251-21.388-15.805-32.677-4.39-7.527-14.05-10.067-21.45-5.708-7.496 4.36-10.067 13.924-5.708 21.419 5.707 9.847 10.192 19.035 13.673 28.161 2.383 6.24 8.342 10.067 14.645 10.067 1.882 0 3.763-.345 5.613-1.004 8.091-3.104 12.137-12.167 9.032-20.258zM248.094 5.12c-59.428 0-116.848 21.293-161.693 59.929-6.585 5.645-7.307 15.555-1.662 22.109a15.658 15.658 0 0 0 11.886 5.456c3.637 0 7.275-1.254 10.223-3.794 39.2-33.744 89.345-52.34 141.245-52.34 8.656 0 15.68-7.025 15.68-15.68s-7.024-15.68-15.68-15.68zM73.668 98.667c-6.711-5.52-16.59-4.516-22.077 2.164-7.213 8.812-13.956 18.596-20.573 29.98-4.359 7.495-1.818 17.091 5.645 21.45a15.644 15.644 0 0 0 7.872 2.133c5.425 0 10.662-2.791 13.578-7.809 5.74-9.878 11.541-18.346 17.719-25.84 5.488-6.712 4.516-16.59-2.164-22.078zM248.093 475.52c-10.16 0-20.51-.753-31.673-2.352-8.436-.94-16.496 4.767-17.719 13.328-1.191 8.561 4.767 16.495 13.328 17.718 12.607 1.82 24.43 2.666 36.378 2.666 8.655 0 15.523-7.025 15.523-15.68s-7.181-15.68-15.837-15.68zm-74.448-13.234c-48.577-17.122-89.502-51.305-115.154-96.15-4.328-7.589-13.83-10.16-21.42-5.833-7.525 4.297-10.128 13.893-5.832 21.388 29.416 51.399 76.267 90.536 131.963 110.199 1.756.596 3.512.878 5.237.878 6.46 0 12.513-4.014 14.77-10.443 2.886-8.185-1.41-17.154-9.564-20.039zm260.539-233.13c-1.318-8.53-9.471-14.426-17.876-13.109-8.53 1.317-14.425 9.314-13.108 17.876A145.702 145.702 0 0 1 404.893 256c0 16.15-2.477 31.924-7.37 46.883-2.665 8.248 1.788 17.091 10.036 19.788 1.6.502 3.23.753 4.86.753a15.706 15.706 0 0 0 14.928-10.788c5.896-18.126 8.906-37.193 8.906-56.636 0-8.938-.658-17.907-2.07-26.844zm-14.05-48.42c-2.477-6.429-5.644-12.544-9.25-18.66-4.454-7.463-14.144-9.878-21.482-5.519-7.496 4.422-9.973 14.018-5.551 21.482 2.697 4.579 5.143 9.157 7.024 13.987 2.415 6.209 8.374 10.035 14.646 10.035 1.85 0 3.794-.345 5.613-1.066 8.09-3.105 12.105-12.168 9-20.259zM226.141 84.743c-1.787-8.499-10.098-13.987-18.565-12.199-27.722 5.77-53.939 18-75.86 35.374-6.773 5.394-7.902 15.272-2.508 22.046a15.711 15.711 0 0 0 12.293 5.927c3.387 0 6.836-1.129 9.753-3.387 18.063-14.363 39.764-24.492 62.72-29.227 8.467-1.756 13.892-10.067 12.167-18.534zM118.577 141.85c-6.931-5.206-16.747-3.764-21.952 3.167-4.109 5.488-7.872 11.29-11.29 17.123-4.39 7.463-1.882 17.06 5.582 21.45a15.399 15.399 0 0 0 7.903 2.164c5.394 0 10.63-2.791 13.516-7.746 2.854-4.861 5.99-9.69 9.408-14.206 5.206-6.931 3.763-16.778-3.167-21.952zM248.093 412.8c-5.707 0-11.383-.282-16.777-.847-8.467-1.129-16.339 5.269-17.28 13.893-.94 8.624 5.3 16.37 13.893 17.28 6.491.689 13.328 1.034 20.478 1.034 8.655 0 15.523-7.025 15.523-15.68s-7.181-15.68-15.837-15.68zm-58.611-11.478c-21.263-8.279-40.925-21.858-56.856-39.262-5.864-6.335-15.774-6.806-22.14-.973-6.398 5.833-6.837 15.774-.972 22.172 19.16 20.917 42.869 37.287 68.584 47.29a15.853 15.853 0 0 0 5.707 1.067c6.272 0 12.2-3.795 14.583-10.004 3.136-8.06-.847-17.154-8.906-20.29z"
            data-original="#000000" />
      </svg>
      <span class="sr-only">Loading…</span>
   </div>:null
               }
             </div>


        {/* Chat Area */}
        <div
          ref={scrolltoanswerpart}
          className="flex-1 mx-1 my-3 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,255,255,0.15)]  overflow-y-auto no-scrollbar "
        >
          <div className="h-full flex text-xl ">
            <ul className="w-full">
              {result.map((item, index) =>
                item.type == "q" ? (
                  <li
                    className={` flex justify-end py-2  w-full ${
                      item.type === "q" ? "text-cyan-400" : "text-white"
                    }`}
                  >
                    <div className="bg-zinc-700 border border-zinc-500 rounded-3xl px-5 py-3 mr-4 max-w-xl">
                      <Answers
                        key={index}
                        ans={item.text}
                        totalresult={1}
                        index={index}
                      />
                    </div>
                  </li>
                ) : (
                  item.text.map((ansitem, ansindex) => (
                    <li className=" text-left px-10 text-white no-scrollbar">
                      <Answers
                        key={ansindex + Math.random()}
                        ans={ansitem}
                        totalresult={item.length}
                        index={index}
                      />
                    </li>
                  ))
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Input Box */}
        <div className="w-3/4 mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.25)] rounded-full flex items-center px-3 py-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/40">
            <input
              onChange={(eventt) => setquestion(eventt.target.value)}
              value={question}
              onKeyDown={isenter}
              className="w-full bg-transparent text-white placeholder-slate-400 px-4 py-3 outline-none text-lg"
              type="text"
              placeholder="Use my brain..."
            />

            <button
              onClick={askquestion}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 active:scale-90 transition-all duration-300 cursor-pointer"
            >
              🧠
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
