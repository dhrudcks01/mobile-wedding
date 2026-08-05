type TornEdgeProps = {
  /**
   * 한 페이지에 여러 개가 놓이므로 SVG 필터 id가 겹치지 않도록
   * 인스턴스마다 다른 값을 넘깁니다.
   */
  id: string;
  /** true면 종이가 아래쪽으로 찢겨 나갑니다. 밝은 구간 → 어두운 구간에 씁니다. */
  flip?: boolean;
};

/**
 * 어두운 섹션과 밝은 섹션이 직선으로 만나지 않게 하는 경계입니다.
 * 밝은 종이가 찢긴 채 어두운 면 위에 얹힌 모양이라, 찢긴 쪽은 항상 종이 색입니다.
 *
 * 배치: 어두운 섹션 안에 두고 CSS로 그 섹션의 위/아래 끝에 붙입니다.
 * 투명한 부분으로 섹션의 어두운 배경이 그대로 비칩니다.
 */
export function TornEdge({ id, flip = false }: TornEdgeProps) {
  const filterId = `torn-edge-${id}`;

  return (
    <span
      aria-hidden="true"
      className={`torn-edge${flip ? " torn-edge-flip" : ""}`}
    >
      <svg
        className="torn-edge-svg"
        preserveAspectRatio="none"
        viewBox="0 0 430 64"
      >
        {/* 큰 물결은 아래 path가 직접 그리고, 이 필터는 가장자리 섬유만 담당합니다.
            변위 하나로 둘 다 하려고 scale을 키우면 섬유가 아니라 가로로 번진
            얼룩이 됩니다. 주파수를 높게, scale을 작게 잡은 이유입니다. */}
        <filter
          height="180%"
          id={filterId}
          width="140%"
          x="-20%"
          y="-40%"
        >
          <feTurbulence
            baseFrequency="0.35 0.5"
            numOctaves="3"
            result="noise"
            seed="11"
            type="fractalNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* 좌우와 아래를 뷰박스 밖까지 늘려 둡니다. 그래야 필터로 흔들린 뒤에도
            가장자리에 틈이 생기지 않고, 보이는 건 위쪽 찢긴 선 하나뿐입니다. */}
        <path
          d="M-40 32 C 20 24, 60 40, 110 33 S 200 26, 250 35 S 340 44, 390 31 S 450 33, 470 31 V100 H-40 Z"
          fill="var(--color-surface)"
          filter={`url(#${filterId})`}
        />
      </svg>
    </span>
  );
}
