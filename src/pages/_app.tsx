import { globalStyles } from "@/styles/global";
import type { AppProps } from "next/app";
import React from "react";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../components/layout/layout";
import Script from "next/script";
import { ThemeProvider } from "@emotion/react";
import { theme } from "@/styles/theme";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/fallbackui";

declare global {
  // Kakao 함수를 전역에서 사용할 수 있도록 선언
  interface Window {
    Kakao: any;
  }
}
export default function App({ Component, pageProps }: AppProps) {
  // 서로 다른 사용자 요청 사이 데이터 공유 안되게
  const [queryClient] = React.useState(() => new QueryClient());
  function kakaoInit() {
    // 페이지가 로드되면 실행
    window.Kakao.init(process.env.NEXT_PUBLIC_LOGIN);
  }

  return (
    <>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      />
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ThemeProvider theme={theme}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                // reset the state of your app so the error doesn't happen again
                console.log("에러때문에 리셋함");
              }}>
              {globalStyles}
              <Layout>
                <Component {...pageProps} />
                <Script
                  src='https://developers.kakao.com/sdk/js/kakao.js'
                  onLoad={kakaoInit}></Script>
              </Layout>
            </ErrorBoundary>
          </ThemeProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
}
