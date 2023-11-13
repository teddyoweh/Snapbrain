"use client"
import { useParams, useRouter } from "next/navigation"
import Nav from "../../components/nav"
import "../../styles/game.scss"
import MicroServiceClient from "@/app/services/api"
import { useContext, useEffect, useState } from "react"
import { Add,ArrowRight2,ArrowLeft2,Copy,CopySuccess,Minus } from "iconsax-react"
import { useDrag, useDrop } from 'react-dnd';
 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthContext } from "@/app/context/AuthContext"
const Question = ({ question, index, selectedQuestion, setSelectedQuestion, moveQuestion }) => {
    const [, drag] = useDrag({
      type: 'QUESTION',
      item: { index },
    });
  
    const [, drop] = useDrop({
      accept: 'QUESTION',
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveQuestion(draggedItem.index, index);
        }
      },
    });
  
    const isActive = selectedQuestion === index;
  
    return (
      <div
        ref={(node) => drag(drop(node))}
        onClick={() => {
          setSelectedQuestion(index);
        }}
        className={`question ${isActive ? 'active' : ''}`}
      >
        <label htmlFor="">{question}</label>
      </div>
    );
  };
  
function shortenString(str, maxLength = 24) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.substring(0, maxLength) + "...";
    }
}
function RenderTeamBox(id,session){

    return (
        <div className="team-box">
        {
            session.usersession?.userSessions.length >0?
            <div>
         </div>
        :
        <div className="empty-session">
            <label htmlFor="">
                No Users
            </label>
        </div>        }

        </div>

    )
}
function RenderPostQuestions({ sessiondata, setSelectedQuestion,selectedQuestion }) {
    const [questions, setQuestions] = useState(sessiondata.questions);
  
    const moveQuestion = (fromIndex, toIndex) => {
      const updatedQuestions = [...questions];
      const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
      updatedQuestions.splice(toIndex, 0, movedQuestion);
      setQuestions(updatedQuestions);
    };
  
    return (
  
        <div className="question-queue">
          {questions.map((question, index) => (
            <Question
              key={index}
              question={shortenString(question.question)}
              index={index}
              selectedQuestion={selectedQuestion}
              setSelectedQuestion={setSelectedQuestion}
              moveQuestion={moveQuestion}
            />
          ))}
        </div>
     
    );
  }
export default function GamePage(){
    const {id} = useParams()
    const router = useRouter()
    const [sessiondata,setSessiondata] = useState(null)
    const [selectedQuestion,setSelectedQuestion] = useState(null)
    const [gameState,setGameState] = useState(false)
    function getData(){
        MicroServiceClient.getSession({sessionid:id}).then((session)=>{
            console.log(session)
            setSessiondata(session)
            setSelectedQuestion(0)
    
    
        })
    }
    const [copySuccess, setCopySuccess] = useState(false);
    //alert(JSON.stringify(selectedQuestion))
    useEffect(()=>{
        getData()
    
    },[])
    const {userid} = useContext(AuthContext)
     return (
        <DndProvider backend={HTML5Backend}>

         <div className="game">
        <Nav/>
        {
            sessiondata&&selectedQuestion!=null&&
   
        <div className="app-content">
        <div className="top-info">
            <div className="left">
                <label htmlFor="
                " className="title">
            {
                sessiondata.session.title
            }
                 </label>
             
                <div className={gameState?"green-stat":"orange-stat"}></div>
       
            </div>
            <div className="right">
                <label htmlFor="">
                    {sessiondata.session.code}
                </label>
                <div className="copyq"
                onClick={()=>{
                    navigator.clipboard.writeText(sessiondata.session.code)
                    setCopySuccess(true)
                    setTimeout(()=>{
                        setCopySuccess(false)
                    },2000)
                
                }}
                >

            
                {
                                    !copySuccess?
                                    <Copy size="18" color="#fff"/>
                                    :
                                    <CopySuccess size="18" color="#fff"/>
                                }    </div>
            </div>
        </div>
        <div className="contents">
            <div className="board">
                <div className="question-box">
                    <div className="bxax">

                    {
                        sessiondata.questions.length>0?
                 
                    <div className="active-question">
                        <label className="question_test" htmlFor="">
                           
                            {
                                       sessiondata.questions[selectedQuestion]?.question
                            }
                        </label>
                        <div className="answers">
                            {
                                 sessiondata.questions[selectedQuestion]?.answers.map((answer,index)=>{
                                    return (
                                        <div className="answer">
                                            <label htmlFor="">
                                              ({String.fromCharCode(64 + answer.id)})  {answer.value}
                                            </label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>:
                    <div className="active-question">
                        <label className="select-question" htmlFor="">
                           {sessiondata.session.createdby==userid?"Press play to start":"Waiting for host to select a question"}
                        </label>
                    </div>
                    }
                    </div>
                    {
                        sessiondata.session.createdby==userid&&
                
                    <div className="dmx">
                        <div className="next" onClick={()=>{
                            setSelectedQuestion((selectedQuestion - 1) % sessiondata.questions.length)
                        }
                        }>
                            <ArrowLeft2 size="22" color="#341a7c"  />
                        </div>
                        <div className="game_state"
                        >
                            <div className={!gameState?"state_indicator correct":"state_indicator pause"}
                            onClick={()=>{
                                setGameState(!gameState)
                            
                            }}
                            >
                                <label htmlFor="">
                                    {
                                        gameState?"Pause":"Play"
                                    }
                                </label>
                            
                            </div>

                        </div>
                    <div className="next" onClick={()=>{
                      setSelectedQuestion((selectedQuestion + 1) % sessiondata.questions.length)
                    }}>
                    <ArrowRight2 size="22" color="#341a7c"/>
                        </div>
                    </div>    }
                </div>
                {
                    sessiondata.session.createdby==userid&&
              
                <div className="bottom">
                    <div className="col">
                <div className="top">

            
                 <label className="title" htmlFor="">
                        User Queue
                 </label>
                 </div>
                    <div className="user-queue">
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                        <div className="user">
                            <label htmlFor="">
                                Teddy Oweh
                            </label>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                            <div className="top">

                          
                            <label className="title" htmlFor="">
                                Question Queue
                            </label>
                            <div onClick={()=>{
                                router.push(`/game/${id}/questions`)
                            }} className="add">
                                <Add color="#341a7c" size={13}/>
                            </div>
                            </div>
                   
                            <RenderPostQuestions sessiondata={{ questions: [...sessiondata.questions] }} selectedQuestion={selectedQuestion}setSelectedQuestion={setSelectedQuestion} />

                    </div>
                </div>}
            </div>
            
            <div className="teams">
                {
                   [...Array(sessiondata.session.teams)].map((team,index)=>{
                        return (
                            <div className="team">
                                <label htmlFor="" className="team-title">Group {index+1}</label>
                              <RenderTeamBox id={id} session={sessiondata}/>
                            </div>
                        )
                    })
                   
                
                }
                {
                    sessiondata.session.createdby==userid&&
              
                <div className="user-count-box">
                        <div className="icon">
                            <Add size="18" color="#341a7c"/>
                        </div>
                        <label htmlFor="">
                            {
                               sessiondata.session.teams
                            }
                        </label>
                        <div className="icon">
                            <Minus size="18" color="#341a7c"/>
                        </div>
                </div>
}
            </div>
        </div>
        </div>
          }
        </div>
        </DndProvider>
    )
}