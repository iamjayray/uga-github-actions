<template>
  <svg
    data-cy="base-loader"
    width="160"
    height="160"
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <g class="pl__ring-rotate">
        <circle
          class="pl__ring-stroke"
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="hsla(341, 66%, 33%, 1)"
          stroke-width="16"
          stroke-dasharray="452.39 452.39"
          stroke-dashoffset="452"
          stroke-linecap="round"
          transform="rotate(-45,80,80)"
        />
      </g>
    </g>
  </svg>
</template>

<script>
export default {
  name: "BaseLoading",
};
</script>

<style lang="scss" scoped>
.pl {
  display: block;
  width: 9.375em;
  height: 9.375em;
}
.pl__ring-rotate,
.pl__ring-stroke,
.pl__tick {
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.pl__ring-rotate,
.pl__ring-stroke {
  transform-origin: 80px 80px;
}
.pl__ring-rotate {
  animation-name: ringRotate;
}
.pl__ring-stroke {
  animation-name: ringStroke;
  transform: rotate(-45deg);
}

@keyframes ringRotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(720deg);
  }
}
@keyframes ringStroke {
  from,
  to {
    stroke-dashoffset: 452;
    transform: rotate(-45deg);
  }
  50% {
    stroke-dashoffset: 169.5;
    transform: rotate(-180deg);
  }
}
@keyframes tick {
  from,
  3%,
  47%,
  to {
    stroke-dashoffset: -12;
  }
  14%,
  36% {
    stroke-dashoffset: 0;
  }
}
</style>
