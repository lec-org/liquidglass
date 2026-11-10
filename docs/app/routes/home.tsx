import { useState } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import {
  ArrowUpRight,
  ArrowRight,
  AudioLines,
  Pause,
  Play,
  SkipForward,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Waves,
} from "lucide-react";
import { Button, Glass, Progress, Slider, Switch } from "@lec-org/liquidglass";
import { components } from "@/lib/components";
import { baseOptions } from "@/lib/layout.shared";

export function meta() {
  return [
    { title: "Liquid Glass · 让界面，多一点触感。" },
    {
      name: "description",
      content:
        "为 React 打造的玻璃组件。探索真实折射、弹性交互与自由组合的界面。",
    },
  ];
}

function HeroDemo() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(64);
  const [focus, setFocus] = useState(true);
  const [track, setTrack] = useState(0);
  const tracks = [
    "A quieter kind of day",
    "Light through the leaves",
    "Somewhere by the sea",
  ];
  return (
    <div className="hero-demo scene-aurora" data-theme="light">
      <div className="scene-art" data-liquidglass-backdrop aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="hero-demo-label">
        <span className="live-dot" /> LIVE COMPONENTS
      </div>
      <div className="hero-orbit" aria-hidden="true">
        liquid.
      </div>
      <Glass className="music-card">
        <div className="music-cover">
          <Waves size={36} strokeWidth={1.2} />
        </div>
        <div className="music-title">
          <span>STUDIO RADIO</span>
          <strong>{tracks[track]}</strong>
          <p>把世界的音量，调低一点。</p>
        </div>
        <div className="music-progress">
          <Progress value={playing ? 0.62 : 0.36} aria-label="演示播放进度" />
          <span>
            {playing ? "02:38" : "01:32"}
            <span>04:16</span>
          </span>
        </div>
        <div className="music-actions">
          <AudioLines size={20} />
          <Button
            variant="filled"
            tint="#194f47"
            icon={playing ? <Pause size={18} /> : <Play size={18} />}
            aria-label={playing ? "暂停演示" : "播放演示"}
            onClick={() => setPlaying(!playing)}
          />
          <Button
            icon={<SkipForward size={18} />}
            aria-label="下一首演示"
            onClick={() => setTrack((track + 1) % tracks.length)}
          />
        </div>
      </Glass>
      <Glass className="focus-card">
        <div>
          <Sun size={18} />
          <span>专注时刻</span>
          <Switch
            aria-label="专注模式"
            checked={focus}
            onCheckedChange={setFocus}
          />
        </div>
        <p>{focus ? "留一点空间，给好想法。" : "让新的灵感进来。"}</p>
      </Glass>
      <Glass className="volume-card">
        <AudioLines size={17} />
        <Slider
          aria-label="演示音量"
          value={volume}
          onValueChange={setVolume}
        />
        <output>{volume}</output>
      </Glass>
      <span className="hero-demo-note">可交互 UI 演示 · 无音频播放</span>
    </div>
  );
}

export default function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="landing">
        <section className="hero">
          <div className="hero-copy">
            <div className="release-badge">
              <span className="live-dot" /> REACT COMPONENT LIBRARY{" "}
              <span>v0.14</span>
            </div>
            <h1>
              让界面，
              <br />
              多一点<span className="hero-accent">触感。</span>
            </h1>
            <p className="hero-description">
              光线流过，内容浮现。
              <br />
              用轻盈的玻璃与自然的交互，
              <br className="mobile-break" />
              把日常界面变成值得触碰的体验。
            </p>
            <div className="hero-links">
              <Link to="/docs" className="primary-link">
                开始使用 <ArrowUpRight size={18} />
              </Link>
              <Link to="/docs/components" className="secondary-link">
                探索组件 <ArrowRight size={16} />
              </Link>
            </div>
            <div className="hero-facts">
              <span>{components.length} 组组件示例</span>
              <span>TypeScript</span>
              <span>MIT License</span>
            </div>
          </div>
          <HeroDemo />
        </section>
        <div className="landing-strip">
          <span>SMALL DETAILS. REAL FEELING.</span>
          <p>让设计停留在细节里，让代码保持简单。</p>
          <Link to="/docs/playground">
            进入效果调试台 <ArrowUpRight size={15} />
          </Link>
        </div>
        <section className="feature-section">
          <div className="section-intro">
            <span className="eyebrow">BUILT TO FEEL DIFFERENT</span>
            <h2>
              从一层玻璃，
              <br />
              到一个完整界面。
            </h2>
          </div>
          <div className="feature-grid">
            <Link className="feature-card" to="/docs/components/glass">
              <Waves size={23} />
              <h3>让背景参与设计</h3>
              <p>透明表面、光线折射与柔和边缘，为内容增加恰当的层次。</p>
              <span>
                探索 Glass <ArrowUpRight size={15} />
              </span>
            </Link>
            <Link
              className="feature-card"
              to="/docs/components/segmented-control"
            >
              <Sparkles size={23} />
              <h3>每一次交互，都有回应</h3>
              <p>按压、滑动与切换，在真实组件上体验连贯的视觉反馈。</p>
              <span>
                试试分段选择 <ArrowUpRight size={15} />
              </span>
            </Link>
            <Link className="feature-card" to="/docs/playground">
              <SlidersHorizontal size={23} />
              <h3>把它调成你的样子</h3>
              <p>切换背景、明暗与强调色，直接复制适合自己界面的配置。</p>
              <span>
                打开调试台 <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </section>
        <footer className="site-footer">
          <span>
            Liquid Glass <span className="footer-muted">by Lec</span>
          </span>
          <span>
            基于{" "}
            <a
              href="https://github.com/onlymoein/liquidglass"
              target="_blank"
              rel="noreferrer"
            >
              onlymoein/liquidglass
            </a>{" "}
            · MIT
          </span>
          <a href="https://www.fumadocs.dev" target="_blank" rel="noreferrer">
            Built with Fumadocs ↗
          </a>
        </footer>
      </main>
    </HomeLayout>
  );
}
