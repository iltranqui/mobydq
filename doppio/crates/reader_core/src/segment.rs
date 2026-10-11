use unicode_segmentation::UnicodeSegmentation;

/// Splits text into sentences using Unicode sentence boundaries (UAX #29).
/// Each sentence is trimmed, and blank segments are dropped.
pub fn split_sentences(text: &str) -> Vec<&str> {
    text.unicode_sentences()
        .map(str::trim)
        .filter(|s| !s.is_empty())
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn splits_spanish_sentences_including_inverted_question_mark() {
        let es = "Llegaron tarde. ¿Por qué? Nadie lo sabía.";
        assert_eq!(
            split_sentences(es),
            vec!["Llegaron tarde.", "¿Por qué?", "Nadie lo sabía."]
        );
    }

    #[test]
    fn drops_blank_input() {
        assert!(split_sentences("   ").is_empty());
    }
}
