"use client"
import { useParams, useRouter } from "next/navigation"
import Nav from "../../components/nav"
import "../../styles/game.scss"
import MicroServiceClient from "@/app/services/api"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { Add,ArrowRight2,ArrowLeft2,Copy,CopySuccess,Minus } from "iconsax-react"
import { useDrag, useDrop } from 'react-dnd';
 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthContext } from "@/app/context/AuthContext"
import { socketip } from "@/app/config/ip"
import { wrapImg } from "@/app/services/utils"
 
function convertTimestampToTime(timestamp) {
    const date = new Date(timestamp);
    const timeString = date.toLocaleTimeString([], { hour12: true });

    return timeString;
}
const Question = ({ question, index, selectedQuestion, handleSetQuestion, setSelectedQuestion, moveQuestion }) => {
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
       handleSetQuestion(index)
        }}
        className={`question ${isActive ? 'active' : ''}`}
      >
        <label htmlFor="">{question}</label>
      </div>
    );
  };
  
function shortenString(str, maxLength = 34) {
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
function RenderPostQuestions({ sessiondata,  handleSetQuestion,setSelectedQuestion,selectedQuestion }) {
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
            handleSetQuestion={handleSetQuestion}
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
            setSelectedQuestion(session.session.activeQuestion)
            setGameState(session.session.stat)
            setLeaderboardData(session.leaderboard)
            setmaxNumnberTeam(session.session.maxNumnberTeam)
            setTeams(session.session.teams)
    
    
        })
    }
    const [copySuccess, setCopySuccess] = useState(false);
    //alert(JSON.stringify(selectedQuestion))
    useEffect(()=>{
        getData()
    
    },[])
    function groupByTeam(leaderboardData) {
        const teamMap = new Map();
    
        for (const entry of leaderboardData) {
            const team = entry.user.team;
    
            if (!teamMap.has(team)) {
                teamMap.set(team, []);
            }
    
            teamMap.get(team).push(entry);
        }
    
        const groupedData = [];
        for (const [team, entries] of teamMap) {
            groupedData.push({
                team: team,
                entries: entries,
            });
        }
    
        return groupedData;
    }
    
    const {userid} = useContext(AuthContext)
    const [answer,setAnswer] = useState(null)
    const [buzz_data,setBuzzData] = useState([])
    const socketRef = useRef(null);
    const [leaderboarddata,setLeaderboardData] = useState(null)
    const [maxNumnberTeam,setmaxNumnberTeam] = useState(null)
    const [teams,setTeams] = useState(null)
    function answerQuestion(answer,team){
      
        if(sessiondata.session.createdby!=userid){
        
    
        MicroServiceClient.answerQuestion({userid,session:id,questionid:sessiondata.questions[selectedQuestion]._id,answer,team}).then((res)=>{
            console.log(res)
     
            // setAnswer(answer)
        }) 
        .catch((err)=>{
            console.log(err)
            alert("You have already answered this question")
        }
        )
    }
        
    }
    useEffect(() => {
        socketRef.current = new WebSocket(`${socketip}?userId=${userid}&sessionId=${id}`);

        socketRef.current.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'update_stat') {
                setGameState(data.data.stat);
                setSelectedQuestion(data.data.activeQuestion);
                setAnswer(null)
                
           
         
            }
            else if (data.type === 'update_question') {
                setSelectedQuestion(data.data.activeQuestion);
                setAnswer(null)
            }
            else if (data.type === 'update_leaderboard') {
               setLeaderboardData(data.data.leaderboard)
                setAnswer(null)
            }
            else if (data.type === 'update_answer') {
                setAnswer(data.data.activeQuestion);
                console.log(data.data.activeQuestion,'answer')
              console.log(data.data.usersData)
                    setBuzzData([...new Set( data.data.usersData)])
                
            }
            else if (data.type === 'update_buzz') {
              ;
            }
        });

        return () => {
            socketRef.current.close();
        };
    }, [id, userid]);
    function getBuzzData(){
        MicroServiceClient.getBuzzData({sessionid:id,questionid:sessiondata.questions[selectedQuestion]?._id}).then((res)=>{
            setBuzzData(res.usersData)
        })
    } 
    useEffect(()=>{
        if(sessiondata&&selectedQuestion!=null){
            getBuzzData()
        }
    },[sessiondata,selectedQuestion])
    useEffect(()=>{
       setAnswer(null)
    },[selectedQuestion])
    
    const handleChangeGameState = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify({
                type: 'update_stat',
                data:{
                    stat:!gameState,
            
                }  
            }));
            setGameState(!gameState);
        }
    }, [gameState]);
    const handleSetQuestion = useCallback((index) => {
        setAnswer(null)
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify({
                type: 'update_question',
                data:{
               
                    activeQuestion:index
                }  
            }));
            setSelectedQuestion(index);
        }
    }, [gameState]);
    const leaderboardoptions = ["Group","Individual"]
    const [leaderboardoption,setLeaderboardOption] = useState(leaderboardoptions[0])
    const handleTeamsChange = useCallback((value)=>{
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify({
                type: 'update_teamno',
                data:{
               
                    teamno:value
                }  
            }));
          
        }

    })
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
                       gameState&& sessiondata.questions.length>0?
                 
                    <div className="active-question">
                        <label className="question_test" htmlFor="">
                           
                            {
                                       sessiondata.questions[selectedQuestion]?.question
                            }
                        </label>
                        <div className="answers">
                            {
                                 sessiondata.questions[selectedQuestion]?.answers.map((answer_,index)=>{
                                    return (
                                        <div className={answer==index+1?"answer active":"answer"} key={index} onClick={()=>answerQuestion(index+1,0)}>
                                            <label htmlFor="">
                                              ({String.fromCharCode(64 + answer_.id)})  {answer_.value}
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
                            handleSetQuestion((selectedQuestion - 1) % sessiondata.questions.length)
                        }
                        }>
                            <ArrowLeft2 size="22" color="#341a7c"  />
                        </div>
                        <div className="game_state"
                        >
                            <div className={!gameState?"state_indicator correct":"state_indicator pause"}
                            onClick={()=>{
                                handleChangeGameState()
                            
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
                      handleSetQuestion((selectedQuestion + 1) % sessiondata.questions.length)
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
                        {
                            buzz_data.reverse().map((buzz,index)=>{
                                return (
                                    <div key={index} className="user">
                                        <div className="left">

                                        <label className="date" htmlFor="">
                                                {convertTimestampToTime(buzz.date)}
                                          
                                            </label>
                                        <img src={wrapImg(buzz.uimg)} alt=""/>
                                        <label htmlFor="">
                                            {buzz.username}
                                        </label>
                                        <span>
                                            Group {buzz.team}
                                        </span>
                                        </div>
                                        <div className="right">
                                            <label htmlFor="">
                                                {String.fromCharCode(64 +buzz.answerNumber)}
                                            </label>
                                           <div className="ansx">
                                           
                                            {buzz.answerNumber==sessiondata.questions[selectedQuestion].correct?
                                            
                                            <div className="correct">
                                      
                                              
                                            </div>
                                            :
                                            <div className="wrong">
                                               
                                            </div>
                                                }
                                           </div>
                                        </div>
                                       
                                    </div>
                                )
                            })
                        }
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
                   
                            <RenderPostQuestions handleSetQuestion={handleSetQuestion} sessiondata={{ questions: [...sessiondata.questions] }} selectedQuestion={selectedQuestion}setSelectedQuestion={setSelectedQuestion} />

                    </div>
                </div>}
            </div>
            
            <div className="teams">
                {
                   [...Array(sessiondata.session.teams)].map((team,index)=>{
                        return (
                            <div key={index}className="team">
                                <label htmlFor="" className="team-title">Group {index+1}</label>
                              <RenderTeamBox id={id} session={sessiondata}/>
                            </div>
                        )
                    })
                   
                
                }
                {
                    sessiondata.session.createdby==userid&&
              <div className="add-team">
                <label htmlFor="" className="title">
                     Team Count
                </label>
                <div className="user-count-box">
                        <div className="icon"
                        onClick={()=>{
                            handleTeamsChange(teams-1)
                        }}
                        >
                            <Add size="18" color="#341a7c"/>
                        </div>
                        <label htmlFor="">
                            {
                               teams
                            }
                        </label>
                        <div className="icon" onClick={()=>{
                            handleTeamsChange(teams-1)
                        }} >
                            <Minus size="18" color="#341a7c"/>
                        </div>
                </div>
                <div className="add-team-btn">
                <label htmlFor="" className="title">
                    Max User Per Team
                </label>
                <div className="user-count-box">
                        <div className="icon">
                            <Add size="18" color="#341a7c"/>
                        </div>
                        <label htmlFor="">
                            {
                               maxNumnberTeam
                            }
                        </label>
                        <div className="icon">
                            <Minus size="18" color="#341a7c"/>
                        </div>
                </div>
                </div>
            </div>
}
            </div>
        </div>
        <div className="leaderboard-box">
            <label htmlFor="" className="title">

                Leaderboard
            </label>
            <div className="options">
            {
                leaderboardoptions.map((option,index)=>{
                    return (
                        <div key={index} className={leaderboardoption==option?"option active":"option"} onClick={()=>{
                            setLeaderboardOption(option)
                        }}>
                            <label htmlFor="">
                                {option}
                            </label>
                        </div>
                    )
                })
            }

            </div>
            {
                leaderboardoption=="Group"&&
                <div className="leaderboard">
                {
                    groupByTeam(leaderboarddata).map((leaderboard,index)=>{
                        console.log(leaderboarddata)
                        return (
                            <div key={index} className="leaderboard-item">
                                <div className="left">
                                     <label htmlFor="">
                                      Group {index+1}
                                    </label>
                                </div>
                                <div className="right">

                                    <label htmlFor="">
                                        {leaderboard.entries[0].leaderboard.point}
                                    </label>
                                </div>
                            </div>
                        
                        )
                    })
                }
                </div>
            }
            {
                 leaderboardoption=="Individual"&&
        
            <div className="leaderboard">
                {
                    leaderboarddata.map((leaderboard,index)=>{
                        console.log(leaderboarddata)
                        return (
                            <div key={index} className="leaderboard-item">
                                <div className="left">
                                    <img src={wrapImg(leaderboard.user.uimg)} alt=""/>
                                    <label htmlFor="">
                                        {leaderboard.user.username}
                                    </label>
                                    <small>
                                        Group {leaderboard.user.team}
                                    </small>
                                </div>
                                <div className="right">

                                    <label htmlFor="">
                                        {leaderboard.leaderboard.point}
                                    </label>
                                </div>
                            </div>
                        
                        )
                    })
                }
            </div>
                }
        </div>
        </div>
          }
        </div>
        </DndProvider>
    )
}