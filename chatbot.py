import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Load FAQ data
with open("faqs.json", "r", encoding="utf-8") as file:
    faqs = json.load(file)


# Get all FAQ questions
questions = [faq["question"] for faq in faqs]


# Convert questions into TF-IDF vectors
vectorizer = TfidfVectorizer()
question_vectors = vectorizer.fit_transform(questions)


def get_answer(user_question):

    # Convert user's question into a vector
    user_vector = vectorizer.transform([user_question])

    # Calculate similarity
    similarity_scores = cosine_similarity(
        user_vector,
        question_vectors
    )

    # Find the best matching question
    best_match_index = similarity_scores.argmax()
    best_score = similarity_scores[0][best_match_index]

    # Minimum similarity threshold
    if best_score < 0.20:
        return "Sorry, I could not find a suitable answer to your question."

    return faqs[best_match_index]["answer"]


# ==========================================
# START CHATBOT
# ==========================================

print("=" * 45)
print("          CODEALPHA AI FAQ CHATBOT")
print("=" * 45)

print("\nAsk your questions.")
print("Type 'exit' to close the chatbot.\n")


while True:

    user_question = input("You: ").strip()

    if user_question.lower() == "exit":
        print("Bot: Goodbye!")
        break

    if not user_question:
        print("Bot: Please enter a question.")
        continue

    answer = get_answer(user_question)

    print("Bot:", answer)