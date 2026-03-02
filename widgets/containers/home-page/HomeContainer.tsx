"use client";
import ChatEnterButtons from "@/features/home/ui/ChatEnterButtons";
import ConvertAudioWorkerLoad from "@/features/home/ui/ConvertAudioWorkerLoad";
import TestWorkerLoad from "@/features/home/ui/TestWorkerLoad";
import Container from "@/widgets/layout/Container";

const HomeContainer = () => {
  return (
    <Container>
      <TestWorkerLoad />
      <ConvertAudioWorkerLoad />
      <ChatEnterButtons />
    </Container>
  );
};
export default HomeContainer;
