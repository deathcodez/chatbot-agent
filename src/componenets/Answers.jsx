import React, { useEffect, useState } from "react";
import { checkHeading } from "../helper";
import { replaceheadingstars } from "../helper";

const Answers = ({ ans, key }) => {
  const [heading, setheading] = useState(false);
  const [ answer,setanswer]= useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setheading(true);
      setanswer(replaceheadingstars(answer))
    }
  }, []);
  return <>

  {heading?<span className="p-2 text-lg block" >{answer}</span>:<span className="pl-5  text-sm" >{answer}</span>}
  
  </>;
};

export default Answers;
