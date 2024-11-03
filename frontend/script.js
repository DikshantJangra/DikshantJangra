let mm = gsap.matchMedia();

// Phone Responsive Animation
mm.add("(max-width: 700px)", () => {
    gsap.from(".right :nth-child(1)", {
        x: -400,
        duration: 1.5,
    });
});

// PC Responsive Animation
mm.add("(min-width: 701px)", () => {
    gsap.from(".right :nth-child(1)", {
        x: 200,
        duration: 1.5,
    });
});