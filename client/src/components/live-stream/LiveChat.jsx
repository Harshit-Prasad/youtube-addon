export default function LiveChat({ streamId }) {
  return (
    <div className="md:p-4 md:ps-0 w-full flex-grow">
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
