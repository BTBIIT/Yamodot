// import React from "react";
// import Carousel from "react-bootstrap/Carousel";
// import Main_Bg1 from "../assets/image/Main_Bg1.jpg";
// import Main_Bg5 from "../assets/image/Main_Bg5.jpg";
// import Main_Bg9 from "../assets/image/Main_Bg9.jpg";
// import "bootstrap/dist/css/bootstrap.min.css";
// // import "./CarouselSection.css";

// const CarouselSection = () => {
//   return (
//     <div className="main-carousel">
//       <Carousel fade indicators={false} controls={false}>
//         <Carousel.Item>
//           <img
//             className="d-block w-100 carousel-image"
//             src={Main_Bg1}
//             alt="First slide"
//           />
//         </Carousel.Item>
//         <Carousel.Item>
//           <img
//             className="d-block w-100 carousel-image"
//             src={Main_Bg5}
//             alt="Second slide"
//           />
//         </Carousel.Item>
//         <Carousel.Item>
//           <img
//             className="d-block w-100 carousel-image"
//             src={Main_Bg9}
//             alt="Third slide"
//           />
//         </Carousel.Item>
//       </Carousel>
//     </div>
//   );
// };

// export default CarouselSection;

import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Main_Bg1 from "../..//assets/images/Main_Bg1.jpg";
import Main_Bg5 from "../../assets/images/Main_Bg5.jpg";
import Main_Bg9 from "../../assets/images/Main_Bg9.jpg";
import { CarouselContainer } from "../../styles/CommonStyles";
import "bootstrap/dist/css/bootstrap.min.css";

const CarouselSection = () => {
  return (
    <CarouselContainer>
      <Carousel fade indicators={false} controls={false}>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={Main_Bg1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={Main_Bg5}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 carousel-image"
            src={Main_Bg9}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    </CarouselContainer>
  );
};

export default CarouselSection;
