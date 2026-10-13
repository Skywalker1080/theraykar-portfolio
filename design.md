# Design System: Minimalist Editorial Portfolio

A clean, typography-first editorial portfolio aesthetic designed for senior product designers, creative directors, and product leaders. It emphasizes crisp typography, high contrast, generous whitespace, subtle neutral borders, and structured tabular metadata.

---

## 1. Visual Theme & Philosophy

- **Tone & Mood**: Minimalist, intellectual, disciplined, authentic, craft-focused.
- **Visual Rhythm**: High density of whitespace with strict horizontal and vertical alignment lines.
- **Editorial Hierarchy**: Distinct distinction between bold humanist/grotesque headlines, calm body paragraphs, and muted uppercase meta labels.

---

## 2. Color Palette & Tokens

### Neutrals
- **Background Main**: `#FFFFFF` (Pure White) / `#FAFAFA` (Off-white canvas)
- **Background Subtle / Hover**: `#F7F7F8` / `#F3F4F6`
- **Surface Card / Group**: `#FFFFFF`
- **Border / Divider**: `#ECECED` / `#E5E7EB` (Subtle 1px solid dividers)

### Typography & Ink
- **Text Primary (Headlines & High Contrast Text)**: `#111827` (Near black, deep carbon)
- **Text Body (Narrative Copy)**: `#4B5563` / `#374151` (Charcoal, easy on the eyes)
- **Text Secondary / Subtitles**: `#6B7280` (Muted gray)
- **Text Tertiary / Metadata Labels**: `#9CA3AF` (Light gray uppercase tracking)

### Accents & Interactive
- **Interactive Link**: `#111827` (Underlined or subtle hover shift with arrow icon `→`)
- **Accent Highlight**: `#2563EB` (Primary electric blue, restrained usage for links or badges)

---

## 3. Typography Hierarchy

**Primary Font Family**: Clean Sans-Serif (`Inter`, `Plus Jakarta Sans`, or `Geist`) with high legibility and balanced proportions.

| Element | Size | Weight | Line Height | Letter Spacing | Color | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | 36px – 44px | 700 (Bold) | 1.15 | -0.03em | `#111827` | Multi-line statement style; strong presence |
| **Section Label** | 12px – 13px | 600 (SemiBold) | 1.4 | +0.08em | `#9CA3AF` | Uppercase tracking (`EXPERIENCE`, `EDUCATION`) |
| **Narrative Body** | 16px – 18px | 400 (Regular) | 1.65 | -0.01em | `#4B5563` | Paragraphs with generous breathing room |
| **Entity / Company Name**| 16px | 600 (SemiBold) | 1.4 | -0.01em | `#111827` | Paired with brand icon/logo |
| **Role / Degree** | 15px – 16px | 400 (Regular) | 1.4 | 0 | `#6B7280` | Muted contrast compared to company name |
| **Timestamp / Year** | 14px – 15px | 400 (Regular) | 1.4 | 0 | `#9CA3AF` | Tabular lining figures, right aligned |
| **Inline Link / Action** | 16px | 500 (Medium) | 1.5 | -0.01em | `#111827` | Subtle border bottom, trailing arrow (`→`) |

---

## 4. Spacing, Grid & Layout System

- **Max Content Width**: `720px` to `800px` (Centrally aligned single-column reading container).
- **Page Margin**: `32px` mobile, `64px`–`96px` desktop horizontal padding.
- **Section Gap**: `56px` – `72px` vertical margin between major blocks (`Bio`, `Experience`, `Education`).
- **Item Gap**: `20px` – `28px` vertical spacing between tabular list items.
- **Divider Spacing**: `24px` top and bottom margins around hairline dividers (`border-t border-gray-100`).

---

## 5. UI Components & Layout Patterns

### A. Narrative Hero Block
- **Headline**: High-impact two-line statement summarizing discipline and purpose.
- **Bio Paragraphs**: 2–3 concise editorial paragraphs separated by `16px` margin.
- **CTA Link**: Minimalist anchor tag with directional glyph (`Message me →`).

### B. Meta Section Header
- Text: Small caps / uppercase (`text-xs font-semibold tracking-widest text-gray-400`).
- Margin bottom: `24px` before the list begins.

### C. Experience & Education Row (List Items)
- **Grid Layout**: 3-column / flex alignment:
  1. **Brand Identity Column**: 24px × 24px favicon/monogram + Brand Name (e.g., `Razorpay`, `Unacademy`, `Dunzo`, `Microsoft`).
  2. **Role / Title Column**: Secondary muted typography aligned horizontally (`Associate Design Director`, `Design Manager`).
  3. **Date Column**: Monospace/tabular numerical year aligned to the right edge (`2024`, `2021`, `2019-2021`).
- **Dividers**: Optional subtle 1px border (`#F3F4F6`) between rows or clean whitespace spacing without heavy borders.
- **Row Hover State**: Subtle opacity shift or slight background tint (`bg-gray-50/50`) with rounded corners (`rounded-lg`).

---

## 6. Iconography & Brand Badges

- **Brand Assets**: Crisp square or circular logo marks at `24px × 24px` with subtle border-radius (`4px` or full circle).
- **Icons**: Clean geometric line icons (`Lucide` or `Heroicons`), stroke width `1.5px`–`1.75px`.

---

## 7. Interaction & Motion Guidelines

- **Transitions**: `150ms ease-in-out` for all hover states.
- **Link Interactions**: Text color transition `#111827` with slight translateX (`translate-x-1`) on trailing arrows (`→`).
- **Scrolling**: Natural browser momentum scrolling with ample bottom padding (`120px`) for breathing space.
