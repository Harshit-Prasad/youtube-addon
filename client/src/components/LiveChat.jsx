export default function LiveChat({ streamId }) {
  return (
    <div className=" aspect-1/2 w-full sm:w-auto max-w-[600px] h-dvh sm:mt-0 mt-2">
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
