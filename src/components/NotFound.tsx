

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <p className="text-blue-600 font-semibold text-sm mb-4">404</p>
      <h1 className="text-foreground text-5xl font-bold mb-4 tracking-tight">Page not found</h1>
      <p className="text-muted-foreground text-lg mb-8">Sorry, we couldn't find the page you're looking for.</p>
      
      <div className="flex items-center gap-4">
        <a 
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
