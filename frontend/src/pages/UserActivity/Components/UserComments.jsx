import { useSelector } from "react-redux";

export default function UserComments() {
    const {userComments} = useSelector((state) => state.userActivity);
    return (
        <div>
            User Comments
            <ul>
                {userComments.map((comment) => {
                    return (
                        <li>
                            {comment.content}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}