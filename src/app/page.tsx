"use client";

import { useRef, useState } from "react";
import { DummyPlayer } from "./DummyPlayer";
import Canvas from "./components/Canvas";

import MOCK from "./mock.json";

export default function Home() {
  const audioRef = useRef(null!);

  const { bpm, streaming_link, next } = useMockApi();

  return (
    <div className="page">
      <button onClick={next}>next</button>
      <DummyPlayer ref={audioRef} src={streaming_link} />
      <Canvas audio={audioRef} bpm={bpm} />
    </div>
  );
}

// Example

function useMockApi() {
  const [idx, set] = useState(0);
  function next() {
    set((idx + 1) % MOCK.length);
  }
  const { bpm, streaming_link } = MOCK[idx];

  return { bpm, streaming_link, next };
}
