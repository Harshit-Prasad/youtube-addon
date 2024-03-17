export default function LiveChat({ streamId }) {
  return (
    <div className="aspect-square max-w-[400px] mx-auto mt-2">
      live chat code:
      <iframe
        width="520"
        height="616"
        src={`https://www.youtube.com/live_chat?v=${streamId}&amp;embed_domain=${
          import.meta.env.VITE_CLIENT_URL
        }`}
        className="live-show-chat"
      ></iframe>
    </div>
  );
}
