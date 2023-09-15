import React from "react";
import styles from '../../styles/Question.module.css';

export default function QuestionCategoryList({ categories }) {
  return (
    <ul className={styles["question__category-list"]}>
      {categories.map((cat) => (
        <li key={cat} className={styles["question__category"]}>
          {cat}
        </li>
      ))}
    </ul>
  );
}