export function buildDigestTemplate(user, recentPosts) {
  let postListHtml = recentPosts
    .map(
      (post) => `
      <li style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <a href="http://localhost:5173/post/${post.id}" style="color: #333652; font-weight: bold; text-decoration: none;">
        ${post.title}
        </a>
        <div style="color: #5C5F7A; font-size: 14px;">
          from <em>${post.forum.name}</em>
        </div>
      </li>
    `
    )
    .join("");

  return `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f4f4; color: #333652;">
    <h2>Hello ${user.username},</h2>
    <div style="background-color: #333652; color: #ffffff; padding: 20px; border-radius: 10px;">
      <h2 style="margin: 0;">📚 BookNook Digest</h2>
      <p style="margin-top: 8px;">Here’s what you missed from your favorite forums:</p>
    </div>

    <ul style="padding: 20px; margin: 20px 0; background-color: #ffffff; border-radius: 10px; list-style-type: none; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      ${postListHtml}
    </ul>

    <p style="margin: 16px 0; fontsize: 12px;">Keep the conversation going on BookNook!</p>
    <p>
      <a href="http://localhost:5173/user/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #FAD02C; color: #000000; text-decoration: none; font-weight: bold; border-radius: 6px;">
        Visit Your Dashboard
      </a>
    </p>

    <p style="margin-top: 24px; fontsize: 12px;">Happy reading!<br/>Cheers,<br/><strong>The BookNook Team</strong></p>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

    <div style="font-size: 14px; color: #5C5F7A;">
      You’re receiving this email because you subscribed to forum updates.
      <br/>
      <a href="{{unsubscribeUrl}}" style="color: #e57373; text-decoration: underline;">Unsubscribe</a>
    </div>
  </div>
  `;
}

export function noDigestTemplate(user, frequency) {
  const frfr = frequency === "DAILY" ? "today" : frequency === "WEEKLY" ? "this week" : "this month";
  return `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f4f4f4; color: #333652;">
    <h2 style="margin-top: 0;">Hey ${user.username},</h2>
      <div style="background-color: #333652; color: #ffffff; padding: 16px; border-radius: 8px;">
        <h2 style="margin: 0;">📚 BookNook Digest</h2>
        <p>Looks like your subscribed forums have been a little quiet ${frfr}.</p>
      </div>

      <div style="margin-top: 20px; background-color: #ffffff; color:333652; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
        <p>Why not be the first to start a new conversation?</p>
        <a href="http://localhost:5173/user/create-post" 
           style="display: inline-block; margin-top: 10px; padding: 10px 20px; background-color: #FAD02C; color: #000000; text-decoration: none; font-weight: bold; border-radius: 6px;">
          Create a Post
        </a>
      </div>

      <div style="margin-top: 24px; font-size: 14px; color: #5C5F7A;">
        You’re receiving this email because you subscribed to forum updates.
        <br />
        <a href="{{unsubscribeUrl}}" style="color: #e57373;">Unsubscribe</a>
      </div>
    </div>
  `;
}

