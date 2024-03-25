export default function LiveChat({ streamId }) {
  return (
    <div className="md:aspect-1/2 w-full md:w-auto max-w-[600px] h-dvh md:mt-0 mt-2">
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
