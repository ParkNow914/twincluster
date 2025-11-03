# Contributing to Football Manager POC

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 🎯 Project Goals

This is an educational proof-of-concept demonstrating:
- Cross-platform mobile development with React Native
- Game development patterns and architecture
- TypeScript best practices
- Clean, maintainable code

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/twincluster.git
   cd twincluster
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Development Guidelines

### Code Style

- Use **TypeScript** for all new code
- Follow existing code structure and naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use proper typing (avoid `any` when possible)

### File Structure

```
src/
├── models/        # Data models and interfaces
├── screens/       # React Native screens/pages
├── components/    # Reusable UI components
├── services/      # Business logic and game services
├── data/          # Static data and initial state
└── utils/         # Helper functions
```

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add player transfer system`
- `fix: correct match simulation scoring`
- `docs: update README installation steps`
- `refactor: simplify team strength calculation`
- `test: add unit tests for match simulator`

## 🎮 Adding Features

### Priority Areas for Contribution

1. **Gameplay Features**
   - Transfer market
   - Training system
   - Injuries and fitness
   - More competitions

2. **UI/UX Improvements**
   - Better animations
   - Improved layouts
   - Loading states
   - Error handling

3. **Data & Content**
   - More teams
   - More players
   - More leagues
   - Better player generation

4. **Technical Improvements**
   - Save/load functionality
   - Performance optimization
   - Test coverage
   - Code documentation

### Before Submitting a Feature

- [ ] Code compiles without errors (`npx tsc --noEmit`)
- [ ] App runs on at least one platform
- [ ] Code follows project style
- [ ] No console errors or warnings
- [ ] Feature is documented in code comments
- [ ] README updated if needed

## 🧪 Testing

Currently, the project doesn't have automated tests. If you'd like to contribute:

1. Set up a testing framework (Jest, React Native Testing Library)
2. Write tests for core functionality
3. Document how to run tests

## 📦 Submitting Changes

1. **Ensure your code works**
   ```bash
   npm start
   # Test on web, Android, or iOS
   ```

2. **Check TypeScript**
   ```bash
   npx tsc --noEmit
   ```

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes clearly
   - Reference any related issues

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: How to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Platform**: Android/iOS/Web
6. **Screenshots**: If applicable
7. **Error Messages**: Any console errors

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

1. Check if the feature is already planned (see README roadmap)
2. Open an issue with the "enhancement" label
3. Describe the feature and why it's useful
4. Propose an implementation approach (optional)

## 🤝 Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on what's best for the project
- Give and receive feedback gracefully
- Credit others' work

## ⚖️ Legal

By contributing, you agree that your contributions will be licensed under the MIT License.

## 📞 Questions?

If you have questions about contributing:
- Open an issue with your question
- Check existing issues and discussions
- Review the README and code documentation

---

Thank you for contributing! 🎉
