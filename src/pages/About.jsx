import { memo } from "react";

const About = memo(function About() {
  return (
    <div className="container">
      <h1>О нас</h1>
      <p>Добро пожаловать в наш интернет-магазин! Мы предлагаем широкий ассортимент качественных продуктов по доступным ценам.</p>
      <p>Наша цель - обеспечить удобный и безопасный шопинг для наших клиентов.</p>
      <h2>Контакты</h2>
      <p>Email: info@webmarket.com</p>
      <p>Телефон: +7 (123) 456-78-90</p>
    </div>
  );
});

export default About;