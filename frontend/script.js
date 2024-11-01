// var tl = gsap.timeline()

// gsap.from("header .name :nth-child(1)",{
//     x:-1000,
//     duration:1,
// })
// gsap.from("header .name :nth-child(2)",{
//     x:1000,
//     duration:1,
// })

// gsap.from("header p",{
//     y:-100,
//     duration:1
// })

// gsap.from("header", {
//     borderBottomWidth: 0, // Change the border width to 0
//     duration: 2, // Duration of the animation
//     ease: "power1.out" // Easing function
// });

// gsap.from("#box1 .box h2",{
//     x:-200,
//     duration:1,
// })
// gsap.from("#box1 .box li",{
//     x:-200,
//     duration:1,
// })
// gsap.from("#box2 .box h2",{
//     x:400,
//     duration:1,
// })
// gsap.from("#box2 .box li",{
//     x:400,
//     duration:1,
// })

// Select all the boxes in box1 and box2
const boxes = document.querySelectorAll('#box1 .box, #box2 .box');

// Create a staggered animation
gsap.from(boxes, {
    duration: 1, // Duration of the animation
    opacity: 0, // Start from opacity 0
    y: 20, // Start from a position 20px lower
    stagger: 0.2, // Delay of 0.2 seconds between each box animation
    ease: 'power1.out' // Easing function for the animation
});