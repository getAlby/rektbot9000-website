"use client";

import { useEffect } from "react";

export function LightningTip() {
  useEffect(() => {
    const scriptId = "lightning-widget-script";
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://embed.twentyuno.net/js/app.js";
    script.async = true;
    script.id = scriptId;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="mt-4">
      <lightning-widget
        name="Rektbot 2000"
        accent="#fca7de"
        to="rektbot9000@getalby.com"
        image="https://cdn.midjourney.com/2289f72c-2fb4-4a35-b48f-8d57dfc14f0c/0_0.png"
        amounts="100,1000,10000"
      />
    </div>
  );
}

