//! Sentence alignment between two translations of the same text.
//!
//! This is a length-based dynamic program in the spirit of Gale & Church. It is
//! a baseline: sentence-embedding similarity can be added to the block cost later.

use std::ops::Range;

/// Largest number of sentences that may be grouped on one side of a block.
const MAX_BLOCK: usize = 3;
/// Extra cost for any block that is not 1:1, so 1:1 is preferred when lengths allow.
const GROUP_PENALTY: f64 = 0.5;

/// One aligned block: a range of source sentences matched to a range of target sentences.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Link {
    pub src: Range<usize>,
    pub tgt: Range<usize>,
}

#[derive(Debug, PartialEq, Eq)]
pub enum AlignError {
    /// No sequence of blocks (at most `MAX_BLOCK` sentences per side) covers both texts.
    NoPath,
}

/// Aligns two lists of sentence lengths (in characters) into blocks.
pub fn align_by_length(src: &[usize], tgt: &[usize]) -> Result<Vec<Link>, AlignError> {
    let (n, m) = (src.len(), tgt.len());
    // cost[i][j]: lowest cost of aligning the first i source and first j target sentences.
    let mut cost = vec![vec![f64::INFINITY; m + 1]; n + 1];
    // back[i][j]: the block shape (source count, target count) that ends at (i, j).
    let mut back = vec![vec![(0usize, 0usize); m + 1]; n + 1];
    cost[0][0] = 0.0;

    for i in 1..=n {
        for j in 1..=m {
            for a in 1..=MAX_BLOCK.min(i) {
                for b in 1..=MAX_BLOCK.min(j) {
                    let (pi, pj) = (i - a, j - b);
                    if cost[pi][pj].is_infinite() {
                        continue;
                    }
                    let src_chars: usize = src[pi..i].iter().sum();
                    let tgt_chars: usize = tgt[pj..j].iter().sum();
                    let candidate = cost[pi][pj] + block_cost(src_chars, tgt_chars, a, b);
                    if candidate < cost[i][j] {
                        cost[i][j] = candidate;
                        back[i][j] = (a, b);
                    }
                }
            }
        }
    }

    if cost[n][m].is_infinite() {
        return Err(AlignError::NoPath);
    }

    let (mut i, mut j) = (n, m);
    let mut links = Vec::new();
    while i > 0 || j > 0 {
        let (a, b) = back[i][j];
        links.push(Link {
            src: i - a..i,
            tgt: j - b..j,
        });
        i -= a;
        j -= b;
    }
    links.reverse();
    Ok(links)
}

/// Squared log-ratio of lengths, plus a penalty for grouping sentences.
fn block_cost(src_chars: usize, tgt_chars: usize, a: usize, b: usize) -> f64 {
    let ratio = ((src_chars + 1) as f64 / (tgt_chars + 1) as f64).ln();
    let penalty = if a == 1 && b == 1 { 0.0 } else { GROUP_PENALTY };
    ratio * ratio + penalty
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn equal_lengths_align_one_to_one() {
        let links = align_by_length(&[40, 55, 30], &[41, 54, 29]).unwrap();
        assert_eq!(
            links,
            vec![
                Link { src: 0..1, tgt: 0..1 },
                Link { src: 1..2, tgt: 1..2 },
                Link { src: 2..3, tgt: 2..3 },
            ]
        );
    }

    #[test]
    fn two_source_sentences_merge_into_one_target() {
        // The target translator joined the last two source sentences into one.
        let links = align_by_length(&[10, 20, 30], &[10, 50]).unwrap();
        assert_eq!(
            links,
            vec![
                Link { src: 0..1, tgt: 0..1 },
                Link { src: 1..3, tgt: 1..2 },
            ]
        );
    }

    #[test]
    fn empty_texts_align_to_nothing() {
        assert_eq!(align_by_length(&[], &[]).unwrap(), Vec::new());
    }

    #[test]
    fn unreachable_length_mismatch_is_an_error() {
        // Ten source sentences cannot be covered by a single target sentence.
        let src = [10; 10];
        assert_eq!(align_by_length(&src, &[100]), Err(AlignError::NoPath));
    }
}
