import "@/assets/styles.css";
import { define } from "@/utils.ts";

export default define.page(({ Component }) => {
  return (
    <html lang="en" data-theme="silk">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PUP Guide</title>
        <script>
          {`(function(){var m=document.cookie.match(/(?:^|;\\s*)theme=([^;]+)/);if(m)document.documentElement.dataset.theme=m[1];})()`}
        </script>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
