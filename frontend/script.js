gsap.from("#main .mainCenter :nth-child(1)",{
    x:-300,
    duration:1,
})
gsap.from("#main .mainCenter :nth-child(2)",{
    x:300,
    duration:1,
})
gsap.from(".mainCenter .makes", {
    color: "black",
    duration: 1.5,
});

Shery.makeMagnet("#techStack .stackBox .br .frontend i" /* Element to target.*/, {
    //Parameters are optional.
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

  Shery.mouseFollower({
    //Parameters are optional.
    skew: true,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

  Shery.textAnimate("#techStack .techStackHead h2" /* Element to target.*/, {
    //Parameters are optional.
    style: 1,
    y: 10,
    delay: 0.1,
    duration: 2,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });

  Shery.imageEffect("", {
    style: 2, //Select Style
    debug: true, // Debug Panel
    config: {
      /* Config made from debug panel */
    },
    preset: "./presets/wigglewobble.json",
  });

  Shery.hoverWithMediaCircle(".hover-target" /* Element to target.*/, {
    images: ["image1.jpg", "image2.jpg", "image3.jpg"] /*OR*/,
    //videos: ["video1.mp4", "video2.mp4"],
  });