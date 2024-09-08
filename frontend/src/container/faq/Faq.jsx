import React, { useState } from 'react';
import './faq.css';
import NavbarCompHome from '../../components/NavbarCompHome';
import help from '../../images/questions.png';
const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'What is the R&D Grants Management System IIT Ropar? ',
      answer: 'R&D Grants Management System IIT Ropar is a standard platform for the management of all Project Grants within IIT Ropar. Admin, Professors and Fellows use this interface to submit project proposals and reports, and the portal coordinates project review, monitoring and partner performance.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'How do I manage my already awarded grant from within the system? ',
      answer: 'Manage your awarded grants by opening “Dashboard” on the screen. The Project Table provides information regarding awarded grants. From this table, you can do to Summary Page and complete required follow-up forms for awarded grants.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'How can I register on and access the R&D GMS?',
      answer: 'Use your institute IDs to login to the portal.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'How can I print or download a copy of my application for my records?',
      answer: 'You can use the Export to Excel file option available on top of Project Table on Dashboard and Summary Table on Summary Page.',
      image: require('../../images/questions.png').default,
    },
    {
      question: ' What are the different steps of a grant/project?',
      answer: '1. Project is requested 2. Project is Approved 3. Upload necessary details within the cycle of the Project 4. Project Completed.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'As a professor, what all can I do?',
      answer: 'As a professor, you can request a project, view your projects and comment.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'As a fellow, what all can I do?',
      answer: 'As a fellow, you can view the projects in ehich you are added by the professor and comment.',
      image: require('../../images/questions.png').default,
    },
    {
      question: 'How can I check the progress of my project?',
      answer: 'Navigate to Summary Page of the project from the dashboard. There you can find summary tables to check project progress.',
      image: require('../../images/questions.png').default,
    }, 
    {
      question: 'How can I directly send mail to RnD department?',
      answer: 'Click on the third icon of the sidebar Customize your mail!.',
      image: require('../../images/questions.png').default,
    },
  ];

  return (
    <div >
      <NavbarCompHome />
      <div className="Faq-container">
        <h1 className="Faq-title">Frequently Asked Questions</h1>
        <div className="Faq-content">
          {faqData.map((item, index) => (
            <div key={index} className="accordion-item">
              <div
                className={`accordion-item-header ${openIndex === index ? 'open' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className="question-wrapper">
                  <span className="question">{item.question}</span>
                  <img src={item.image}  className="question-image" />
                </div>
              </div>
              {openIndex === index && (
                <div className="accordion-item-content">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
