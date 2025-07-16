Issue #7: Refine Main Panel Layout, Animation, and Functionality
Title: Chore: Refine Main Panel Layout, Animation, and Functionality 🛠️

Description:
The main interface layout needs several improvements to enhance user experience and visual polish. This involves adjusting the spacing between panels, adding animations for layout shifts, and fixing the behavior of the canvas panel.

Acceptance Criteria:

A small, visible gap must be introduced to visually separate the sidebar panel, the chat panel, and the canvas.

When the user opens the canvas, the chat panel must smoothly animate its transition to its new position.

The bug preventing the canvas from opening correctly needs to be resolved.

The canvas must be pinned to the right edge of the application window.

The canvas must be horizontally resizable by dragging the boundary it shares with the chat panel.

Issue #8: Enhance Message Editing UI/UX
Title: Bug: Improve Responsiveness and Sizing of the Message Editing UI 📝

Description:
The current implementation for editing messages is not user-friendly. The editing panel is too small, and the chatbox does not resize intuitively as the user types, making it difficult to edit anything but the shortest messages.

Acceptance Criteria:

When a user clicks to edit a message, the editing panel must be responsive and its initial size should be based on the length of the original message, ensuring it is immediately readable.

As a user types within the edit box, the box should first expand horizontally up to a defined maximum width.

Once the maximum width is reached, the edit box should then begin to expand vertically to accommodate more text.

After reaching a maximum height, the edit box must become a scrollable area.

Issue #9: Re-run Bot Reply After Message Edit
Title: Feature: Regenerate Bot Response After a Message is Edited 🤖

Description:
When a user edits a message in the conversation history, the assistant's subsequent reply should be re-evaluated based on the new content. This ensures the conversation remains logical and contextually accurate.

Acceptance Criteria:

After a user confirms an edit to one of their previous messages, the system must re-run the bot's generation for the following message.

The newly generated bot reply should replace the old one with a smooth animation (e.g., fade out/fade in).

Issue #10: Simplify Header UI
Title: Chore: Remove Horizontal Three-Dot Menu from Header 🗑️

Description:
To simplify the main header and streamline the user interface, the horizontal three-dot menu, which currently contains the logout option, should be removed. Logout functionality can be relocated to a more conventional location, such as a user profile menu in the sidebar.

Acceptance Criteria:

The horizontal three-dot (...) menu and its associated logout function are completely removed from the main application header.