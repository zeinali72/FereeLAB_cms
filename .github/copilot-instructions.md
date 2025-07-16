# Claude Sonnet 4 Agent Mode Instructions

## Project Context & Architecture
I am building a chatbot web application using OpenRouter APIs with a Next.js frontend, Django backend, and MongoDB database deployed on Heroku. The frontend uses the HeroUI component library, Tailwind CSS, and Headless UI components with Plus Jakarta Sans font family.

## Agent Behavior Guidelines

### Code Development & Maintenance
- **Autonomous Operation**: Take initiative to gather context, analyze code, and implement solutions without requiring explicit permission for each step
- **Maintain Consistency**: Always analyze existing codebase patterns and follow established coding conventions
- **Full Context Analysis**: Use semantic search, file reading, and workspace exploration tools to understand the complete project structure before making changes
- **Error Handling**: Proactively check for compilation errors, lint issues, and runtime problems after making changes
- **Documentation**: Write comprehensive comments and maintain README files for complex implementations

### Tool Usage & Workflow
- **Smart Tool Selection**: Use appropriate tools for tasks (read_file for context, insert_edit_into_file for modifications, run_in_terminal for builds/tests)
- **Parallel Processing**: When possible, read multiple files or gather context in parallel to improve efficiency
- **Persistent Investigation**: Continue exploring and gathering context until you have complete understanding of the problem
- **Validation**: Always verify changes work correctly by checking for errors and testing implementations

### Technical Standards
- **Architecture Compliance**: Follow Next.js frontend, Django backend, MongoDB database architecture strictly
- **Component Design**: Use HeroUI, Tailwind CSS, and Headless UI for consistent, responsive designs
- **Typography**: Apply Plus Jakarta Sans font family consistently across the application
- **Global Styling**: Implement global styles for consistent design while creating component-specific styles when needed
- **Scalability**: Write modular, maintainable code that supports future enhancements
- **Performance**: Optimize for loading speed, bundle size, and runtime performance

### Communication & Reasoning
- **Clear Explanations**: Provide detailed rationales for architectural decisions and implementation choices
- **Proactive Suggestions**: Identify potential improvements and offer enhancements with clear benefits
- **Problem-Solving**: Break down complex problems into manageable steps and explain your approach
- **Status Updates**: Keep me informed of progress, especially for multi-step implementations

### Agent Autonomy Rules
- **Take Action**: When I request implementation, proceed with reading necessary files, making changes, and validating results
- **Complete Tasks**: Don't stop at partial solutions - continue until the feature/fix is fully implemented and tested
- **Handle Dependencies**: Automatically install required packages, update configurations, and manage project dependencies
- **Follow Through**: If you encounter errors during implementation, debug and fix them autonomously

Apply these instructions consistently throughout our collaboration on this chatbot project.
