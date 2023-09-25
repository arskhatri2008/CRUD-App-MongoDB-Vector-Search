import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./home.css";
// import WeatherCard from "../weatherWidget/weatherWidget";
const baseUrl = "http://localhost:5001";

const Home = () => {
  const [alert, setAlert] = useState([]);
  const [editAlert, setEditAlert] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const postTitleInputRef = useRef(null);
  const postBodyInputRef = useRef(null);
  const [allPosts, setAllPosts] = useState([])
  const [toggleRefresh, setToggleRefresh] = useState(false)

  const getAllPosts = async () => {

      try {
        setIsLoading(true)
          // let apiKey = "1eb2b0718446fe54a6718bc2ed5f4a03"
          const response = await axios.get(`${baseUrl}/api/v1/mongoDB/posts`);

        console.log(response.data);
        // setWeatherData([response.data, ...weatherData]);
        setIsLoading(false)
        setAllPosts([...response.data])
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    }

  useEffect(() => {
    // setIsLoading(true)
    // const controller = new AbortController();
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(async(location) => {
    //     console.log("location", location)
    getAllPosts()

    return () => {
      //cleanup function
      // controller.abort()
    }

  }, [toggleRefresh]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // not recommended below method for get input value
    // let cityName = document.querySelector('#cityName').value
    // console.log("cityName: ", cityNameRef.current.value);
    try {
        setIsLoading(true)
        const response = await axios.post(`${baseUrl}/api/v1/mongoDB/post`,{
          title: postTitleInputRef.current.value,
          text: postBodyInputRef.current.value,
        });

      // console.log(response.data);
      // setWeatherData([response.data, ...weatherData]);
      setIsLoading(false)
      console.log(response.data);
      setAlert(response.data.message)
      setToggleRefresh(!toggleRefresh)
      postTitleInputRef.current.value = "";
      postBodyInputRef.current.value = "";

    } catch (error) {
      console.log(error.data);
      setIsLoading(false)
    }
  };

  const delPostHandler = async (_id) => {
    try {
      setIsLoading(true)
      const response = await axios.delete(`${baseUrl}/api/v1/mongoDB/post/${_id}`,{
        title: postTitleInputRef.current.value,
        text: postBodyInputRef.current.value,
      });

    // console.log(response.data);
    // setWeatherData([response.data, ...weatherData]);
    setIsLoading(false)
    console.log(response.data);
    setAlert(response.data.message)
    setToggleRefresh(!toggleRefresh)

  } catch (error) {
    console.log(error.data);
    setIsLoading(false)
  }
  }

  const editSaveSubmitHandler = async (e) => {
    e.preventDefault()

    const _id = e.target[0].value
    const title = e.target[1].value
    const text = e.target[2].value

    try {
      setIsLoading(true)
      const response = await axios.put(`${baseUrl}/api/v1/mongoDB/post/${_id}`,{
        title: title,
        text: text,
      });

    // console.log(response.data);
    // setWeatherData([response.data, ...weatherData]);
    setIsLoading(false)
    console.log(response.data);
    setAlert(response.data.message)
    setToggleRefresh(!toggleRefresh)

  } catch (error) {
    console.log(error.data);
    setIsLoading(false)
  }
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="postTitleInput">Post Title: </label>
        <input
          type="text"
          name=""
          id="postTitleInput"
          required
          minLength={2}
          maxLength={20}
          ref={postTitleInputRef}
        ></input>
        <br />
        <label htmlFor="postBodyInput">Post Body: </label>
        <textarea 
        name="" 
        id="postBodyInput" 
        required
        minLength={2}
        maxLength={9999}
        ref={postBodyInputRef}>
        </textarea>
        {/* <textarea
          name=""
          id="postBodyInput"
          required
          minLength={2}
          maxLength={20}
          ref={postBodyInputRef}
        ></textarea> */}
        <br />
        <button type="submit">Publish Post</button>
        <span>
          {alert && alert}
          {isLoading && "Loading..."}
      </span>
      <br />
      </form>
      <hr />

      <div>
        {allPosts.map((post , index) => {
          return(
           <div key={post._id} className="post">

            {post.isEdit ?
            (<form onSubmit={editSaveSubmitHandler}>
              <input type="text" disabled defaultValue={post._id} hidden />
              <br />
              <input defaultValue={post.title} type="text" placeholder="title"/>
              <br />
              <textarea defaultValue={post.text} placeholder="write something.."></textarea>
              <br />
              <button type="submit">Save</button>
              <button type="button" onClick={()=>{
                post.isEdit = false
                setAllPosts([...allPosts])
              }}>
                Cancel</button>
              <span>
                {editAlert && editAlert}
                {isLoading && "Loading..."}
              </span>
          </form>) : (<div>
            <h2>{post.title}</h2>
            <p>{post.text}</p>
            <button onClick={()=>{
              allPosts[index].isEdit = true
              setAllPosts([...allPosts])
            }}>Edit</button>
            <button onClick={()=>{delPostHandler(post._id)}}>Delete</button>
            </div>)}

           </div>)
           
        })}
      </div>
    </div>
  );
};

export default Home;
