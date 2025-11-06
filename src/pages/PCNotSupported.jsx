import React from "react";
import styled, { keyframes } from "styled-components";

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: "Inter", "Segoe UI", -apple-system, BlinkMacSystemFont,
    sans-serif;

  .dark-mode & {
    background: #1a1a1a;
  }
`;

const Content = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Logo = styled.div`
  font-family: "Fredoka One", cursive;
  font-size: 2.5rem;
  font-weight: 400;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto 0.8rem;
  text-align: center;
  animation: ${float} 3s ease-in-out infinite;
`;

const Message = styled.p`
  font-size: 0.95rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0;

  .dark-mode & {
    color: #b0b0b0;
  }
`;

const PCNotSupported = () => {
  return (
    <Container>
      <Content>
        <Logo>UniLingo</Logo>
        <Message>
          이 서비스는 모바일 환경에서만 이용할 수 있습니다.
          <br />
          스마트폰으로 접속해주세요.
        </Message>
      </Content>
    </Container>
  );
};

export default PCNotSupported;
