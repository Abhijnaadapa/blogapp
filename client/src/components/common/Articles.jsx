import {useState} from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
function Articles() {

    const [articles,setArticles]=useState([])
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
  
    const [error,setError]=useState('')
    const navigate=useNavigate()
    const {getToken}=useAuth()
    //get all articles
   async function getArticles(){
      const token=await getToken()
      let res=await axios.get('http://localhost:3001/author-api/articles',{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      })
      console.log("API Response:", articles);

      if(res.data.message==='articles'){
        setArticles(res.data.payload)

      }else{
        setError(res.data.message)
      }
    }
    const categories = [
      ...new Set(articles.map((article) => article.category)),
    ];
    //goto specific article
    function gotoArticlesbyId(articleobj){
        navigate(`../${articleobj.articleId}`,{state:articleobj})
    }
    useEffect(() => {
      if (categoryFilter) {
        setFilteredArticles(
          articles.filter((article) => article.category === categoryFilter)
        );
      } else {
        setFilteredArticles(articles);
      }
    }, [categoryFilter, articles]);
    useEffect(()=>{
      getArticles()
    },[])
    console.log(articles)
  return (
    <div className='container'>
      <div>
      <div className="mb-4">
        <select
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {
           filteredArticles.length === 0 ? (
            <p className="text-danger">No articles found</p>
          ) : ( 
            filteredArticles.map((articleobj)=>
              <div className="col" key={articleobj.articleId}>
               <div className="card h-100">
                <div className="card-body">
                  <div className="author-details text-end">
                    <img src={articleobj.authorData.profileImageurl} width='40px' className='rounded-circle' alt="" />
                    <p>
                      <small className='text-secondary'>{articleobj.authorData.nameofAuthor}</small>
                    </p>
                  </div>
                  {articleobj.isArticleActive===true ?
                  <h5 className='card-title text-secondary'>{articleobj.title}</h5>
                  :<h5 className='card-title text-danger'>{articleobj.title}</h5> }
                  <p className='card-text'>
                    {articleobj.content.substring(0,80)+"...."}
                  </p>
                  <button className='custom-btn btn-4 ' onClick={()=>{gotoArticlesbyId(articleobj)}}>
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                  <small className="text-body-secondary">
                    Last updated on  {articleobj.dateOfModification}
                  </small>
                </div>
                </div> 
              </div>
             ) )
            }
        </div>
      </div>
    </div>
  )
}

export default Articles