"""
Build Your First AI Agent in 60 Lines of Python
No framework needed - just the Anthropic SDK

Author: Archit Mittal (@automate-archit)
Blog: https://architmittal.com
Article: https://dev.to/automate-archit/build-your-first-ai-agent-in-60-lines-of-python-no-framework-needed-4368
"""

from anthropic import Anthropic

client = Anthropic()

# Define tools the agent can use
tools = [
      {
                "name": "calculator",
                "description": "Performs basic math operations",
                "input_schema": {
                              "type": "object",
                              "properties": {
                                                "expression": {
                                                                      "type": "string",
                                                                      "description": "Math expression to evaluate"
                                                }
                              },
                              "required": ["expression"]
                }
      },
      {
                "name": "search_notes",
                "description": "Searches through personal notes",
                "input_schema": {
                              "type": "object",
                              "properties": {
                                                "query": {
                                                                      "type": "string",
                                                                      "description": "Search query"
                                                }
                              },
                              "required": ["query"]
                }
      }
]


def execute_tool(name, input_data):
      """Execute a tool and return the result."""
      if name == "calculator":
                try:
                              result = eval(input_data["expression"])
                              return str(result)
except Exception as e:
            return f"Error: {e}"
elif name == "search_notes":
        notes = {
                      "meeting": "Team sync moved to 3pm Thursday",
                      "project": "AI agent deadline is next Friday",
        }
        query = input_data["query"].lower()
        matches = [v for k, v in notes.items() if query in k]
        return "\n".join(matches) if matches else "No notes found"
    return "Unknown tool"


def run_agent(user_message):
      """Run the agent with an observe-think-act loop."""
      messages = [{"role": "user", "content": user_message}]

    while True:
              response = client.messages.create(
                            model="claude-sonnet-4-20250514",
                            max_tokens=1024,
                            tools=tools,
                            messages=messages,
              )

        # If no tool use, return the final text
              if response.stop_reason == "end_turn":
            return "".join(
                              block.text for block in response.content
                              if hasattr(block, "text")
            )

        # Process tool calls
        tool_results = []
        for block in response.content:
                      if block.type == "tool_use":
                                        result = execute_tool(block.name, block.input)
                                        tool_results.append({
                                            "type": "tool_result",
                                            "tool_use_id": block.id,
                                            "content": result,
                                        })

                  messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})


if __name__ == "__main__":
      print(run_agent("What's 42 * 17, and any notes about the project?"))
