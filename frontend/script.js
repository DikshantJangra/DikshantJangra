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

Shery.makeMagnet("i, ion-icon, p, .ri-blender-fill, h2, h1, img, video" /* Element to target.*/, {
    //Parameters are optional.
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });

  Shery.mouseFollower({
    //Parameters are optional.
    skew: true,
    // ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    duration: 1,
  });
  Shery.textAnimate("#projects .projectContent p" /* Element to target.*/, {
    //Parameters are optional.
    style: 1,
    y: 10,
    delay: 0.1,
    duration: 0.1,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });

  Shery.textAnimate("#main nav h1" /* Element to target.*/, {
    //Parameters are optional.
    style: 1,
    y: 10,
    delay: 0.2,
    duration: 1,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });
   
  Shery.textAnimate("#techStack h2, #projects h2, #connectWithMe h2" /* Element to target.*/, {
    //Parameters are optional.
    style: 1,
    y: 10,
    delay: 0.1,
    duration: 0.1,
    ease: "cubic-bezier(0.23, 1, 0.320, 1)",
    multiplier: 0.1,
  });