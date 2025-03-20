import { useSelector } from "react-redux"

export default function UserOverview() {
    const userActivity = useSelector((state) => state.userActivity)
    console.log(userActivity);
    
    return (
        <>
        <div>
            FORUMS
            <ul>
                {userActivity?.userForums?.publicForums?.map((forum) => {
                    return (<li>
                        {forum.name}
                    </li>)
                })}
            </ul>
        </div>
        <div>
            POSTS
            <ul>
                {userActivity?.userPosts?.map((post) => {
                    return(<li>
                        {post.title}
                    </li>)
                })}
            </ul>
        </div>
        <div>
            COMMENTS
            <ul>
                {userActivity?.userComments?.map((comment) => {
                    return(<li>
                        {comment.content}
                    </li>)
                })}
            </ul>
        </div>
        </>
    )
}