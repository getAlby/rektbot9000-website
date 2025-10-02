"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function WidgetPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-accent/80">$ ./tip-widget.sh</div>
      <div className="rounded-lg border border-accent/20 bg-black/40 p-4">
        <div className="mb-3 text-sm text-accent/70"># Lightning widget preview</div>
        {ready ? (
          <lightning-widget
            name="Rektbot 9000"
            accent="#FF71CD"
            to="rektbot9000@getalby.com"
            image="https://cdn.midjourney.com/2289f72c-2fb4-4a35-b48f-8d57dfc14f0c/0_0.png"
            amounts="100,1000,10000"
          />
        ) : (
          <pre className="text-accent">echo &quot;booting widget...&quot;</pre>
        )}
        <Script src="https://embed.twentyuno.net/js/app.js" strategy="afterInteractive" />
      </div>
    </div>
  );
}

