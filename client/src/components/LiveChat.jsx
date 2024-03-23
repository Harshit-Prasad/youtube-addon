export default function LiveChat({ streamId }) {
  return (
    <div className="aspect-square max-w-[600px] mx-auto mt-2">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/live_chat?v=${streamId}&embed_domain=${
          import.meta.env.VITE_DOMAIN_NAME
        }`}
      ></iframe>
    </div>
  );
}
