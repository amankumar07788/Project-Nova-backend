import tkinter as tk
from tkinter import ttk, messagebox
import requests


# ==========================================
# LANGUAGE TRANSLATION TOOL - CODEALPHA
# ==========================================

# Supported languages and their API codes
LANGUAGES = {
    "English": "en",
    "Hindi": "hi",
    "French": "fr",
    "Spanish": "es",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Russian": "ru",
    "Japanese": "ja",
    "Korean": "ko",
    "Chinese": "zh"
}


# ==========================================
# TRANSLATION FUNCTION
# ==========================================

def translate_text():

    text = input_text.get("1.0", tk.END).strip()

    source_language = source_combo.get()
    target_language = target_combo.get()

    # Check input
    if not text:
        messagebox.showwarning(
            "Warning",
            "Please enter some text to translate."
        )
        return

    # Check language selection
    if not source_language or not target_language:
        messagebox.showwarning(
            "Warning",
            "Please select both source and target languages."
        )
        return

    # Same language check
    if source_language == target_language:
        output_text.config(state="normal")
        output_text.delete("1.0", tk.END)
        output_text.insert(tk.END, text)
        output_text.config(state="disabled")
        return

    source_code = LANGUAGES[source_language]
    target_code = LANGUAGES[target_language]

    # MyMemory Translation API
    url = "https://api.mymemory.translated.net/get"

    parameters = {
        "q": text,
        "langpair": f"{source_code}|{target_code}"
    }

    try:

        # Send request to API
        response = requests.get(
            url,
            params=parameters,
            timeout=15
        )

        # Check HTTP response
        response.raise_for_status()

        # Convert response to JSON
        data = response.json()

        # Get translated text
        translated_text = data["responseData"]["translatedText"]

        # Display translated text
        output_text.config(state="normal")

        output_text.delete(
            "1.0",
            tk.END
        )

        output_text.insert(
            tk.END,
            translated_text
        )

        output_text.config(
            state="disabled"
        )

    except requests.exceptions.Timeout:

        messagebox.showerror(
            "Error",
            "The translation request timed out.\n"
            "Please check your internet connection."
        )

    except requests.exceptions.ConnectionError:

        messagebox.showerror(
            "Error",
            "Unable to connect to the translation API.\n"
            "Please check your internet connection."
        )

    except requests.exceptions.RequestException as error:

        messagebox.showerror(
            "API Error",
            f"Translation API error:\n\n{error}"
        )

    except Exception as error:

        messagebox.showerror(
            "Error",
            f"Something went wrong:\n\n{error}"
        )


# ==========================================
# COPY TRANSLATED TEXT
# ==========================================

def copy_translation():

    translated = output_text.get(
        "1.0",
        tk.END
    ).strip()

    if not translated:

        messagebox.showwarning(
            "Warning",
            "There is no translated text to copy."
        )

        return

    window.clipboard_clear()

    window.clipboard_append(
        translated
    )

    window.update()

    messagebox.showinfo(
        "Copied",
        "Translated text copied to clipboard."
    )


# ==========================================
# CLEAR ALL TEXT
# ==========================================

def clear_text():

    input_text.delete(
        "1.0",
        tk.END
    )

    output_text.config(
        state="normal"
    )

    output_text.delete(
        "1.0",
        tk.END
    )

    output_text.config(
        state="disabled"
    )


# ==========================================
# SWAP LANGUAGES
# ==========================================

def swap_languages():

    source = source_combo.get()
    target = target_combo.get()

    source_combo.set(target)
    target_combo.set(source)

    current_input = input_text.get(
        "1.0",
        tk.END
    ).strip()

    current_output = output_text.get(
        "1.0",
        tk.END
    ).strip()

    input_text.delete(
        "1.0",
        tk.END
    )

    input_text.insert(
        tk.END,
        current_output
    )

    output_text.config(
        state="normal"
    )

    output_text.delete(
        "1.0",
        tk.END
    )

    output_text.insert(
        tk.END,
        current_input
    )

    output_text.config(
        state="disabled"
    )


# ==========================================
# MAIN WINDOW
# ==========================================

window = tk.Tk()

window.title(
    "CodeAlpha - Language Translation Tool"
)

window.geometry(
    "800x700"
)

window.resizable(
    False,
    False
)


# ==========================================
# TITLE
# ==========================================

title = tk.Label(
    window,
    text="LANGUAGE TRANSLATION TOOL",
    font=("Arial", 22, "bold")
)

title.pack(
    pady=(20, 5)
)


subtitle = tk.Label(
    window,
    text="CodeAlpha Artificial Intelligence Internship",
    font=("Arial", 11)
)

subtitle.pack(
    pady=(0, 20)
)


# ==========================================
# INPUT SECTION
# ==========================================

input_label = tk.Label(
    window,
    text="Enter Text",
    font=("Arial", 13, "bold")
)

input_label.pack(
    anchor="w",
    padx=50
)


input_text = tk.Text(
    window,
    height=7,
    width=80,
    font=("Arial", 12),
    wrap=tk.WORD
)

input_text.pack(
    padx=50,
    pady=10
)


# ==========================================
# LANGUAGE SELECTION
# ==========================================

language_frame = tk.Frame(
    window
)

language_frame.pack(
    pady=10
)


# Source language

source_label = tk.Label(
    language_frame,
    text="Source Language",
    font=("Arial", 11, "bold")
)

source_label.grid(
    row=0,
    column=0,
    padx=10
)


source_combo = ttk.Combobox(
    language_frame,
    values=list(LANGUAGES.keys()),
    state="readonly",
    width=18
)

source_combo.grid(
    row=1,
    column=0,
    padx=10,
    pady=5
)

source_combo.set(
    "English"
)


# Swap button

swap_button = tk.Button(
    language_frame,
    text="⇄",
    command=swap_languages,
    font=("Arial", 14, "bold"),
    width=4
)

swap_button.grid(
    row=1,
    column=1,
    padx=10
)


# Target language

target_label = tk.Label(
    language_frame,
    text="Target Language",
    font=("Arial", 11, "bold")
)

target_label.grid(
    row=0,
    column=2,
    padx=10
)


target_combo = ttk.Combobox(
    language_frame,
    values=list(LANGUAGES.keys()),
    state="readonly",
    width=18
)

target_combo.grid(
    row=1,
    column=2,
    padx=10,
    pady=5
)

target_combo.set(
    "Hindi"
)


# ==========================================
# BUTTONS
# ==========================================

button_frame = tk.Frame(
    window
)

button_frame.pack(
    pady=15
)


translate_button = tk.Button(
    button_frame,
    text="TRANSLATE",
    command=translate_text,
    font=("Arial", 12, "bold"),
    padx=30,
    pady=10
)

translate_button.grid(
    row=0,
    column=0,
    padx=10
)


clear_button = tk.Button(
    button_frame,
    text="CLEAR",
    command=clear_text,
    font=("Arial", 12, "bold"),
    padx=30,
    pady=10
)

clear_button.grid(
    row=0,
    column=1,
    padx=10
)


copy_button = tk.Button(
    button_frame,
    text="COPY",
    command=copy_translation,
    font=("Arial", 12, "bold"),
    padx=30,
    pady=10
)

copy_button.grid(
    row=0,
    column=2,
    padx=10
)


# ==========================================
# OUTPUT SECTION
# ==========================================

output_label = tk.Label(
    window,
    text="Translated Text",
    font=("Arial", 13, "bold")
)

output_label.pack(
    anchor="w",
    padx=50
)


output_text = tk.Text(
    window,
    height=7,
    width=80,
    font=("Arial", 12),
    wrap=tk.WORD
)

output_text.pack(
    padx=50,
    pady=10
)

output_text.config(
    state="disabled"
)


# ==========================================
# FOOTER
# ==========================================

footer = tk.Label(
    window,
    text="Powered by MyMemory Translation API",
    font=("Arial", 9)
)

footer.pack(
    pady=5
)


# ==========================================
# START APPLICATION
# ==========================================

window.mainloop()
