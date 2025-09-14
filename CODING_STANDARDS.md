# Coding Standards & Best Practices

## Core Principles

### Code Reusability
- Extract common functionality into reusable functions/modules
- Create utility functions for repeated operations
- Use composition over duplication
- Build modular, composable components

### Function Size & Responsibility
- Keep functions small and focused on single responsibilities
- Functions should ideally be under 20-30 lines
- One function = one clear purpose
- Use descriptive function names that explain intent

### File Organization
- Keep files reasonably sized (under 200-300 lines when possible)
- Break large files into smaller, well-organized modules
- Group related functionality together
- Use clear file naming conventions

### Architecture Principles
- **Single Responsibility Principle**: Each module/class should have one reason to change
- **DRY (Don't Repeat Yourself)**: Eliminate code duplication
- **Separation of Concerns**: Separate different aspects of functionality
- **Composition over Inheritance**: Prefer composing behavior over inheritance
- **Interface Segregation**: Use small, focused interfaces

### Code Quality
- Write self-documenting code with clear variable/function names
- Minimize complexity and nested conditions
- Use consistent formatting and style
- Handle errors appropriately
- Write testable code

## Implementation Guidelines
- Extract constants and configuration values
- Use dependency injection where appropriate
- Implement proper error handling
- Follow language-specific conventions
- Optimize for readability and maintainability