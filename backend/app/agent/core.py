
from __future__ import annotations

import logging
from typing import Any, Dict, List

from langchain.agents import AgentExecutor, create_react_agent  # pyright: ignore[reportMissingImports]
from langchain.prompts import PromptTemplate  # pyright: ignore[reportMissingImports]
from langchain_groq import ChatGroq  # pyright: ignore[reportMissingImports]

from app.config import settings
from app.agent.callbacks import LLMOpsCallbackHandler
from app.agent.prompts import SYSTEM_PROMPT_v1
from app.agent.tools import (
    geocode_stop_tool,
    search_saved_stops_tool,
    search_saved_trips_tool,
    get_trip_by_id_tool,
    get_recent_history_tool,
)


logger = logging.getLogger(__name__)


_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=settings.groq_api_key,
)

_tools = [
    geocode_stop_tool,
    search_saved_stops_tool,
    search_saved_trips_tool,
    get_trip_by_id_tool,
    get_recent_history_tool,
]

_prompt = PromptTemplate(
    template=SYSTEM_PROMPT_v1,
    input_variables=["input", "chat_history", "agent_scratchpad", "tools", "tool_names"],
)

_agent = create_react_agent(_llm, _tools, _prompt)

_agent_executor = AgentExecutor(
    agent=_agent,
    tools=_tools,
    verbose=True,
    max_iterations=15,
    handle_parsing_errors=True,
    callbacks=[LLMOpsCallbackHandler()],
    return_intermediate_steps=True,
)


def _format_history(raw_history: List[Any]) -> str:
    """
    Format raw conversation history into a readable string.
    Handles both plain dicts and Pydantic model objects.
    """
    lines: List[str] = []
    for msg in raw_history:
        if isinstance(msg, dict):
            role = msg.get("role")
            content = msg.get("content", "")
        else:
            role = getattr(msg, "role", None)
            content = getattr(msg, "content", "")
        if role == "user":
            prefix = "Driver"
        elif role == "assistant":
            prefix = "Assistant"
        else:
            prefix = "Other"
        lines.append(f"{prefix}: {content}")
    return "\n".join(lines)


def _extract_stops_from_steps(intermediate_steps: list) -> List[Dict[str, Any]]:
    """
    Extract geocoded stops from the agent's intermediate tool calls.
    """
    stops: List[Dict[str, Any]] = []
    position = 0
    for action, observation in intermediate_steps:
        if action.tool == "geocode_stop" and isinstance(observation, dict):
            if observation.get("success"):
                stops.append({
                    "label": action.tool_input if isinstance(action.tool_input, str) else str(action.tool_input),
                    "resolved": observation.get("formatted_address", ""),
                    "lat": observation.get("lat"),
                    "lng": observation.get("lng"),
                    "note": None,
                    "position": position,
                })
                position += 1
    return stops


async def run_agent(
    message: str,
    conversation_history: List[Dict[str, Any]] | None = None,
    db: Any | None = None,
) -> Dict[str, Any]:
    """
    Run the LangChain ReAct agent for a single driver message.

    Parameters:
    - message: current user message string.
    - conversation_history: list of previous messages (dicts with role/content).
    - db: SQLAlchemy Session (currently unused by tools; reserved for future use).

    Returns:
    - dict with {reply, stops?, trip_id?, needs_confirmation?}
    """
    chat_history_str = _format_history(conversation_history or [])

    result = await _agent_executor.ainvoke(
        {
            "input": message,
            "chat_history": chat_history_str,
        }
    )

    reply = result.get("output", "")
    intermediate = result.get("intermediate_steps", [])

    # Extract structured stops from geocode tool calls
    stops = _extract_stops_from_steps(intermediate)

    response: Dict[str, Any] = {"reply": reply}
    if stops:
        response["stops"] = stops
        response["needs_confirmation"] = True

    return response
