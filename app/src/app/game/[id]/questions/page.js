"use client"
import { useEffect, useState } from "react"
import Nav from "../../../components/nav"
import "../../../styles/game.scss"
import { useParams, useRouter } from "next/navigation"
import MicroServiceClient from "../../../services/api"
import { wrapImg } from "../../../services/utils"
import { ArrowLeft,Add,Plus, Minus ,SearchNormal} from "iconsax-react"


 

 
function RenderPostQuestions({session,sid,setdata,data}) {
    return (
        <div className="post-questions">
            {
               data.map((question,index)=>{
                    return (
                        <div  key={index} className="question-box">
                            <div className="question">
                                <label htmlFor="">
                                    {question.question}
                                </label>
                            </div>
                            <div className="answers">
                                {
                                    question.answers.map((answer,index)=>{
                                        return (
                                            <div key={index }className="answer">
                                                <label htmlFor="">
                                                    {answer.value}
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="correct-answer">
                                <label htmlFor="">
                                  Answer:  {question.answers[question.correct-1].value} ({String.fromCharCode(64 + question.answers[question.correct-1].id)})
                                </label>
                            </div>
                        </div>
                    )
                })
            }
            {
                data.length==0&&
                <div className="empty-session">
                    <label htmlFor="">
                        No Questions
                    </label>
                </div>
            }
        </div>
    )
}
function RenderAddQuestion({sid,setdata}) {
    const [question, setQuestion] = useState('');
    const [numOfAnswers, setNumOfAnswers] = useState(1);
    const [answers, setAnswers] = useState(Array.from({ length: numOfAnswers }, (_, index) => ({ id: index + 1, value: '' })));
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');


    const handleAddQuestion = () => {
        setError(null);
        if (question.trim() === '') {
            setError('Please enter a question.');
            return;
        }

        const trimmedAnswers = answers.map(answer => answer.value.trim());
        if (!trimmedAnswers.some(answer => answer !== '')) {
            setError('Please enter at least one answer.');
            return;
        }

        if (correctAnswer === '' ) {
            setError('Please choose a valid correct answer.');
            return;
        }

        MicroServiceClient.addQuestion({question,answers:Object.values(answers),correct:correctAnswer,sessionid:sid}).then((res)=>{
            console.log(res)
            setdata(res)
            setSuccess("Question Added")
            setTimeout(()=>{
                setSuccess(null)
            },3000)

        })

        console.log('Question:', question);
        console.log('Answers:', answers);
        console.log('Correct Answer:', correctAnswer);
    };

    const handleAnswerChange = (id, value) => {
        setAnswers(answers.map(answer => (answer.id === id ? { ...answer, value } : answer)));
    };

    const handleAddAnswer = () => {
        setNumOfAnswers(numOfAnswers + 1);
        setAnswers([...answers, { id: numOfAnswers + 1, value: '' }]);
    };

    const handleRemoveAnswer = (id) => {
        if (numOfAnswers > 1) {
            setNumOfAnswers(numOfAnswers - 1);
            setAnswers(answers.filter(answer => answer.id !== id));
        }
    };

    return (
        <div className="add-question">
            {
                error&&
         
            <div className="create-question-error">
                {error}
                </div>    }
                {
                success&&
         
            <div className="create-sucess-error">
                {success}
                </div>    }
            <div className="question-input-box">
                <input
                    type="text"
                    placeholder="What is the purpose of a turbine?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </div>
             
            {answers.map((answer,index) => (
                <div key={index}className="input-section">

          
                <div key={answer.id} className="input-box">
                    <input
                        type="text"
                        placeholder={`Answer ${String.fromCharCode(64 + answer.id)})`}
                        value={answer.value}
                        onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                    />
                    {numOfAnswers > 1 && (
                        <div className="button" onClick={() => handleRemoveAnswer(answer.id)}>
                            <Minus size="16" />
                        </div>
                    )}
                </div>
                <div onClick={()=>{
                    setCorrectAnswer(index+1)
                 }} className={correctAnswer==index+1?"correct-input input-tick":"input-tick"}>
                ✓
                </div>
                </div>
            ))}
            <div className="addanswer" onClick={handleAddAnswer}>
                <Add size="20" />
                Add Answer
            </div>
          
            <div className="bxtn" onClick={handleAddQuestion}>
                Add Question
            </div>
        </div>
    );
}

 

 
export default function QuestionPage(){

    const {id} = useParams()
    const [sessiondata,setSessiondata] = useState(null)
    const [searchTerm, setSearchTerm] = useState('');
    const filteredQuestions = sessiondata?.questions.filter((question) => {
 
        const questionText = question.question.toLowerCase();
        if (questionText.includes(searchTerm.toLowerCase())) {
            return true;
        }
        const hasMatchingAnswer = question.answers.some(
            (answer) => answer.value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return hasMatchingAnswer;
    });
    const router = useRouter()
    function getData(){
        MicroServiceClient.getSession({sessionid:id}).then((session)=>{
            console.log(session)
            setSessiondata(session)
        })
    }
    useEffect(()=>{
        getData()
    
    },[])
    return (
        <div className="game question-add">
        <Nav/>
        {
            sessiondata&&
   
        <div className="app-content">
        <div className="top-info">
            <div className="left">
                <label htmlFor="
                " className="title">
            {
                sessiondata.session.title
            }
                 </label>
 
       
            </div>
        </div>
        <div className="settings">

        <div className="left">

   
        <div className="back"
        
        onClick={()=>{router.back()}}
        >
            <ArrowLeft
            size={16}
            />
        </div>
        <label htmlFor="">

            Questions ({sessiondata.questions.length?sessiondata.questions.length:0})
        </label>
        </div>
        <div className="searchquestions">
            <SearchNormal color="#341a7c48"/>
        <input type="text"  placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        </div>
        <div className="add-section">
            <RenderAddQuestion sid={id} setdata={setSessiondata}/>
            <RenderPostQuestions session={sessiondata} data={filteredQuestions} sid={id} setdata={setSessiondata}/>
        </div>
     
        </div>
          }
        </div>
    )
}