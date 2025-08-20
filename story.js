/**
 * Story Data - Complete Lifeline-style space adventure
 * Features real-time decision making, multiple endings, and character development
 */

const STORY_DATA = {
    start: {
        id: 'start',
        character: {
            name: 'Alex Chen',
            status: 'online'
        },
        messages: [
            "Our ship was investigating an anomalous signal near Europa when we hit something. The hull is breached and we're losing life support.",
            "The captain and most of the crew... they didn't make it. I'm alone in the emergency pod bay.",
            "I can see the damage on my monitors. Life support is at 78%, power systems are down to 42%. I'm trying to stay calm but...",
            "The emergency lighting is flickering and I can smell something burning... probably the electrical systems."
        ],
        choices: [
            {
                text: "What's your current status? Are you injured?",
                type: "safe",
                next: "assess_injury"
            },
            {
                text: "You need to get to the escape pods immediately!",
                type: "urgent",
                next: "rush_to_pods"
            },
            {
                text: "Tell me about the ship's systems. What's still working?",
                type: "technical",
                next: "systems_check"
            }
        ]
    },

    establish_contact: {
        id: 'establish_contact',
        messages: [
            "Thank you for responding. I'm Alex Chen, xenobiologist aboard the Meridian.",
            "We were investigating an anomalous energy signature near Europa when we hit something. The impact was massive.",
            "The hull is breached in multiple compartments. Life support is failing, and I can see fires in the engineering section.",
            "Captain Rodriguez and most of the crew... they didn't make it. I'm alone in the emergency pod bay.",
            "I need to get to the escape pods, but the corridor is blocked by debris. I can hear the ship groaning around me.",
            "I'm going to start transmitting my vital signs and ship data to you. The systems are damaged but I can still send basic telemetry."
        ],
        choices: [
            {
                text: "Can you access the ship's diagnostic systems? We need to assess the damage.",
                type: "technical",
                next: "diagnostic_check"
            },
            {
                text: "Focus on getting to the escape pods. Time is critical.",
                type: "urgent",
                next: "escape_priority"
            },
            {
                text: "Stay calm, Alex. Let's work through this step by step.",
                type: "supportive",
                next: "calm_approach"
            }
        ]
    },

    assess_injury: {
        id: 'assess_injury',
        messages: [
            "I'm okay, just some cuts from debris. Nothing serious.",
            "But I can hear the hull groaning. The structural integrity is failing fast.",
            "The emergency lighting is flickering and I can smell something burning... probably the electrical systems."
        ],
        choices: [
            {
                text: "Check the escape pod status first, then we'll plan your route.",
                type: "safe",
                next: "pod_status_check"
            },
            {
                text: "Grab the emergency supply kit before you do anything else.",
                type: "technical",
                next: "grab_supplies"
            },
            {
                text: "Get moving now! Time is running out!",
                type: "urgent",
                next: "immediate_movement"
            }
        ]
    },

    diagnostic_check: {
        id: 'diagnostic_check',
        messages: [
            "I can access the main computer from here. Let me check the systems...",
            "Life support is at 78% and dropping. Oxygen levels are critical.",
            "Power systems are at 42% and failing. The backup generators are damaged.",
            "Structural integrity is at 23%. The ship is breaking apart.",
            "I can see the escape pods are still functional, but the route is blocked."
        ],
        choices: [
            {
                text: "Can you reroute power to life support? Buy us more time.",
                type: "technical",
                next: "power_reroute"
            },
            {
                text: "Forget the diagnostics. Focus on finding a way to the pods.",
                type: "urgent",
                next: "find_route"
            },
            {
                text: "How long do we have before life support fails completely?",
                type: "safe",
                next: "time_assessment"
            }
        ]
    },

    power_reroute: {
        id: 'power_reroute',
        messages: [
            "I can try to reroute power from non-essential systems to life support.",
            "The computer is responding... I'm diverting power from the research labs.",
            "Life support is now at 85% and stabilizing. That should buy us some time.",
            "But the power systems are still failing. We're down to 38% now."
        ],
        telemetry_effect: {
            oxygenLevel: 85,
            powerLevel: 38,
            stressLevel: 40
        },
        choices: [
            {
                text: "Good work. Now let's focus on getting you to the escape pods.",
                type: "supportive",
                next: "find_route"
            },
            {
                text: "Can you access the ship's schematics? Find an alternate route.",
                type: "technical",
                next: "schematic_check"
            },
            {
                text: "The power reroute worked. Let's try to stabilize the ship.",
                type: "safe",
                next: "stabilize_ship"
            }
        ]
    },

    find_route: {
        id: 'find_route',
        messages: [
            "I need to find a way to the escape pods. The main corridor is blocked.",
            "I can see sparks coming from the damaged section. It looks dangerous but I might be able to squeeze through.",
            "Or I could take the maintenance shaft, but that would take longer...",
            "There's also a service corridor on the port side, but I'm not sure if it's accessible."
        ],
        choices: [
            {
                text: "Take the maintenance shaft. Safety first.",
                type: "safe",
                next: "maintenance_shaft",
                action: {
                    type: "delay",
                    message: "Alex is crawling through the maintenance shaft...",
                    duration: 4000
                }
            },
            {
                text: "Push through the debris quickly before it gets worse.",
                type: "urgent",
                next: "debris_shortcut"
            },
            {
                text: "Check the service corridor first. It might be safer.",
                type: "technical",
                next: "service_corridor"
            }
        ]
    },

    maintenance_shaft: {
        id: 'maintenance_shaft',
        messages: [
            "I'm taking the maintenance shaft. It's tight but should be safer.",
            "I can hear the ship's systems failing around me. The power is fluctuating.",
            "I'm almost through... wait, there's a blockage ahead.",
            "I can see light through a small gap. I think I can squeeze through."
        ],
        telemetry_effect: {
            oxygenLevel: 82,
            powerLevel: 35,
            stressLevel: 45
        },
        choices: [
            {
                text: "Take your time. Don't get stuck.",
                type: "safe",
                next: "shaft_escape"
            },
            {
                text: "Hurry up! The ship is falling apart!",
                type: "urgent",
                next: "shaft_escape"
            },
            {
                text: "Can you see what's blocking the way?",
                type: "technical",
                next: "shaft_escape"
            }
        ]
    },

    shaft_escape: {
        id: 'shaft_escape',
        messages: [
            "I made it through! I'm in the main corridor now.",
            "The escape pods are just ahead. I can see them.",
            "But there's smoke coming from the engineering section. The fires are spreading.",
            "I need to get to the pods quickly. The ship is breaking apart."
        ],
        telemetry_effect: {
            oxygenLevel: 75,
            powerLevel: 30,
            stressLevel: 50
        },
        choices: [
            {
                text: "Get to the pods now! Don't stop for anything!",
                type: "urgent",
                next: "reach_pods"
            },
            {
                text: "Check the pod systems before boarding.",
                type: "technical",
                next: "pod_check"
            },
            {
                text: "Stay calm. You're almost there.",
                type: "supportive",
                next: "reach_pods"
            }
        ]
    },

    reach_pods: {
        id: 'reach_pods',
        messages: [
            "I'm at the escape pods! I can see three pods available.",
            "Pod 1 shows green status. Pod 2 has a warning light. Pod 3 is offline.",
            "I'm going to board Pod 1. It looks the most reliable.",
            "The ship is shaking violently now. I need to launch immediately."
        ],
        telemetry_effect: {
            oxygenLevel: 70,
            powerLevel: 25,
            stressLevel: 55
        },
        choices: [
            {
                text: "Launch immediately! The ship is failing!",
                type: "urgent",
                next: "launch_escape"
            },
            {
                text: "Check the pod's systems first. Make sure it's ready.",
                type: "technical",
                next: "pod_systems_check"
            },
            {
                text: "Take a moment to breathe. You're safe now.",
                type: "supportive",
                next: "launch_escape"
            }
        ]
    },

    launch_escape: {
        id: 'launch_escape',
        messages: [
            "I'm launching the escape pod!",
            "The pod is separating from the ship. I can see the Meridian breaking apart.",
            "The pod's systems are all green. Life support is stable.",
            "I'm safe. The pod is on course for the nearest rescue beacon.",
            "Thank you for helping me through this. I wouldn't have made it without your guidance."
        ],
        telemetry_effect: {
            oxygenLevel: 100,
            powerLevel: 100,
            stressLevel: 30
        },
        ending: {
            type: "success",
            title: "Mission Accomplished",
            message: "Alex Chen successfully escaped the doomed Meridian. Your guidance helped save a life.",
            stats: {
                survivalTime: "15 minutes",
                choicesMade: "8",
                trustLevel: "High",
                ending: "Escape Success"
            }
        }
    },

    // ALTERNATE BRANCHES AND ENDINGS

    debris_shortcut: {
        id: 'debris_shortcut',
        messages: [
            "I'm pushing through the debris. It's dangerous but faster.",
            "I can feel the heat from the electrical fires. The air is thick with smoke.",
            "I'm almost through... wait, something's wrong.",
            "I'm stuck! The debris shifted and I'm trapped!"
        ],
        telemetry_effect: {
            oxygenLevel: 65,
            powerLevel: 20,
            stressLevel: 70
        },
        choices: [
            {
                text: "Stay calm! Try to free yourself!",
                type: "supportive",
                next: "trapped_escape"
            },
            {
                text: "Can you reach any tools? Try to pry yourself free.",
                type: "technical",
                next: "trapped_escape"
            },
            {
                text: "We need to find another way. Can you go back?",
                type: "safe",
                next: "find_route"
            }
        ]
    },

    trapped_escape: {
        id: 'trapped_escape',
        messages: [
            "I'm trying to free myself... the debris is heavy.",
            "I can see the escape pods from here, but I can't reach them.",
            "The ship is shaking more violently. I think it's going to break apart.",
            "I'm not going to make it... I'm sorry."
        ],
        telemetry_effect: {
            oxygenLevel: 45,
            powerLevel: 15,
            stressLevel: 85
        },
        ending: {
            type: "failure",
            title: "Mission Failed",
            message: "Alex Chen became trapped in the debris and could not reach the escape pods. The Meridian was lost with all hands.",
            stats: {
                survivalTime: "12 minutes",
                choicesMade: "6",
                trustLevel: "Low",
                ending: "Trapped in Debris"
            }
        }
    },

    stabilize_ship: {
        id: 'stabilize_ship',
        messages: [
            "I'm trying to stabilize the ship's systems. Maybe I can buy more time.",
            "I'm rerouting power from all non-essential systems to structural integrity.",
            "The ship is responding... the shaking is lessening.",
            "But the damage is too extensive. The ship is still failing."
        ],
        telemetry_effect: {
            oxygenLevel: 60,
            powerLevel: 25,
            stressLevel: 60
        },
        choices: [
            {
                text: "The ship is doomed. Get to the escape pods now!",
                type: "urgent",
                next: "find_route"
            },
            {
                text: "Can you access the emergency protocols?",
                type: "technical",
                next: "emergency_protocols"
            },
            {
                text: "You've done what you can. It's time to save yourself.",
                type: "supportive",
                next: "find_route"
            }
        ]
    },

    emergency_protocols: {
        id: 'emergency_protocols',
        messages: [
            "I'm accessing the emergency protocols...",
            "There's an emergency beacon system. I can activate it.",
            "The beacon will signal for help, but it will drain the remaining power.",
            "I'm activating the emergency beacon. At least someone will know what happened here."
        ],
        telemetry_effect: {
            oxygenLevel: 55,
            powerLevel: 15,
            stressLevel: 65
        },
        choices: [
            {
                text: "Good thinking. Now get to the escape pods!",
                type: "supportive",
                next: "find_route"
            },
            {
                text: "The beacon will help future rescue missions. Launch it.",
                type: "technical",
                next: "beacon_launch"
            },
            {
                text: "Forget the beacon. Save yourself first!",
                type: "urgent",
                next: "find_route"
            }
        ]
    },

    beacon_launch: {
        id: 'beacon_launch',
        messages: [
            "I'm launching the emergency beacon. It's transmitting our location and data.",
            "The beacon is away. Future crews will know what happened here.",
            "Now I need to get to the escape pods. The power is almost gone.",
            "I can barely see in the emergency lighting. The ship is dying."
        ],
        telemetry_effect: {
            oxygenLevel: 50,
            powerLevel: 10,
            stressLevel: 70
        },
        ending: {
            type: "partial_success",
            title: "Beacon Launched",
            message: "Alex Chen launched the emergency beacon before the ship was lost. Future rescue missions will have critical data about the incident.",
            stats: {
                survivalTime: "18 minutes",
                choicesMade: "10",
                trustLevel: "Medium",
                ending: "Beacon Success, Personal Loss"
            }
        }
    },

    // CRITICAL TELEMETRY-BASED SCENARIOS

    time_assessment: {
        id: 'time_assessment',
        messages: [
            "Let me calculate the remaining time...",
            "At current oxygen consumption rates, I have about 15 minutes before life support fails completely.",
            "But the structural integrity is failing faster. The ship could break apart in 8-10 minutes.",
            "I need to reach the escape pods within the next 5 minutes to be safe."
        ],
        telemetry_effect: {
            oxygenLevel: 75,
            powerLevel: 35,
            stressLevel: 45
        },
        choices: [
            {
                text: "You have 5 minutes. Move quickly but carefully.",
                type: "urgent",
                next: "find_route"
            },
            {
                text: "Can you optimize your oxygen consumption?",
                type: "technical",
                next: "oxygen_optimization"
            },
            {
                text: "Stay focused. We'll get you out in time.",
                type: "supportive",
                next: "find_route"
            }
        ]
    },

    oxygen_optimization: {
        id: 'oxygen_optimization',
        messages: [
            "I can try to reduce my oxygen consumption. Slow, deep breaths.",
            "I'm also shutting down non-essential systems to reduce power drain.",
            "The oxygen levels are stabilizing... I might have gained a few more minutes.",
            "But I still need to move quickly. The ship is still failing."
        ],
        telemetry_effect: {
            oxygenLevel: 80,
            powerLevel: 30,
            stressLevel: 40
        },
        choices: [
            {
                text: "Good work. Now get moving to the escape pods.",
                type: "supportive",
                next: "find_route"
            },
            {
                text: "Can you access the emergency oxygen supply?",
                type: "technical",
                next: "emergency_oxygen"
            },
            {
                text: "Every minute counts. Move now!",
                type: "urgent",
                next: "find_route"
            }
        ]
    },

    // Additional missing nodes
    escape_priority: {
        id: 'escape_priority',
        messages: [
            "You're right. I need to focus on getting to the escape pods.",
            "The main corridor is blocked, but I can see the maintenance shaft.",
            "I'm heading there now. The ship is shaking more violently.",
            "I can hear metal groaning. This ship isn't going to hold together much longer."
        ],
        telemetry_effect: {
            oxygenLevel: 75,
            powerLevel: 35,
            stressLevel: 50
        },
        choices: [
            {
                text: "Take the maintenance shaft. It's safer.",
                type: "safe",
                next: "maintenance_shaft"
            },
            {
                text: "Push through the debris. Time is critical.",
                type: "urgent",
                next: "debris_shortcut"
            },
            {
                text: "Check for alternate routes first.",
                type: "technical",
                next: "find_route"
            }
        ]
    },

    calm_approach: {
        id: 'calm_approach',
        messages: [
            "Thank you. I'm trying to stay calm.",
            "Let me think this through systematically.",
            "I need to assess my options: escape pods, life support, and time remaining.",
            "The escape pods are my priority, but I need to get there safely."
        ],
        telemetry_effect: {
            oxygenLevel: 78,
            powerLevel: 42,
            stressLevel: 30
        },
        choices: [
            {
                text: "Check the ship's systems first. Know what you're working with.",
                type: "technical",
                next: "diagnostic_check"
            },
            {
                text: "Focus on the escape route. What's the safest path?",
                type: "safe",
                next: "find_route"
            },
            {
                text: "You're doing great. Let's get you to safety.",
                type: "supportive",
                next: "find_route"
            }
        ]
    },

    schematic_check: {
        id: 'schematic_check',
        messages: [
            "I'm accessing the ship's schematics...",
            "There's a service corridor on the port side that might be accessible.",
            "It's longer but should be safer than the main corridor.",
            "The schematics show it connects directly to the escape pod bay."
        ],
        telemetry_effect: {
            oxygenLevel: 82,
            powerLevel: 36,
            stressLevel: 42
        },
        choices: [
            {
                text: "Take the service corridor. Safety over speed.",
                type: "safe",
                next: "service_corridor"
            },
            {
                text: "Good find. Let's get moving.",
                type: "supportive",
                next: "service_corridor"
            },
            {
                text: "The corridor might be blocked too. Try the maintenance shaft.",
                type: "technical",
                next: "maintenance_shaft"
            }
        ]
    },

    service_corridor: {
        id: 'service_corridor',
        messages: [
            "I'm heading to the service corridor. It's a longer route but should be safer.",
            "The corridor is clear so far. No debris or damage visible.",
            "I can hear the ship's systems failing in the distance.",
            "I'm almost to the escape pod bay. The corridor is holding up well."
        ],
        telemetry_effect: {
            oxygenLevel: 80,
            powerLevel: 32,
            stressLevel: 45
        },
        choices: [
            {
                text: "Good progress. Keep moving.",
                type: "supportive",
                next: "reach_pods"
            },
            {
                text: "Check the pod bay status before entering.",
                type: "technical",
                next: "pod_check"
            },
            {
                text: "Hurry! The ship is still failing.",
                type: "urgent",
                next: "reach_pods"
            }
        ]
    },

    pod_check: {
        id: 'pod_check',
        messages: [
            "I'm checking the pod bay systems from the corridor.",
            "Pod 1 shows green status. Pod 2 has a warning light. Pod 3 is offline.",
            "The bay door mechanism appears functional.",
            "I should be able to access the pods safely."
        ],
        telemetry_effect: {
            oxygenLevel: 78,
            powerLevel: 30,
            stressLevel: 48
        },
        choices: [
            {
                text: "Board Pod 1. It's the most reliable.",
                type: "safe",
                next: "reach_pods"
            },
            {
                text: "Check what's wrong with Pod 2 first.",
                type: "technical",
                next: "pod_systems_check"
            },
            {
                text: "Get to the pods now. Time is critical.",
                type: "urgent",
                next: "reach_pods"
            }
        ]
    },

    pod_systems_check: {
        id: 'pod_systems_check',
        messages: [
            "I'm checking Pod 2's systems...",
            "The warning light is for the navigation system. It's a minor issue.",
            "The life support and engines are all green.",
            "I can probably fix the navigation issue quickly, or launch with the warning."
        ],
        telemetry_effect: {
            oxygenLevel: 75,
            powerLevel: 28,
            stressLevel: 50
        },
        choices: [
            {
                text: "Fix the navigation issue. Better safe than sorry.",
                type: "technical",
                next: "fix_navigation"
            },
            {
                text: "Launch with the warning. Time is more important.",
                type: "urgent",
                next: "launch_escape"
            },
            {
                text: "Go with Pod 1 instead. It's safer.",
                type: "safe",
                next: "reach_pods"
            }
        ]
    },

    fix_navigation: {
        id: 'fix_navigation',
        messages: [
            "I'm working on the navigation system...",
            "It's just a sensor calibration issue. I can fix this.",
            "The system is responding... navigation is now green.",
            "Pod 2 is fully operational now. I'm boarding."
        ],
        telemetry_effect: {
            oxygenLevel: 72,
            powerLevel: 25,
            stressLevel: 52
        },
        choices: [
            {
                text: "Excellent work. Launch when ready.",
                type: "supportive",
                next: "launch_escape"
            },
            {
                text: "Good thinking. Now get out of here!",
                type: "urgent",
                next: "launch_escape"
            },
            {
                text: "Double-check all systems before launch.",
                type: "safe",
                next: "launch_escape"
            }
        ]
    },

    emergency_oxygen: {
        id: 'emergency_oxygen',
        messages: [
            "I'm checking for emergency oxygen supplies...",
            "There's an emergency tank in the pod bay. I can access it.",
            "The tank is full and functional. This will give me extra time.",
            "I'm connecting it to my suit. Oxygen levels are now stable."
        ],
        telemetry_effect: {
            oxygenLevel: 95,
            powerLevel: 25,
            stressLevel: 45
        },
        choices: [
            {
                text: "Perfect. Now get to the escape pods.",
                type: "supportive",
                next: "find_route"
            },
            {
                text: "Good thinking. You have more time now.",
                type: "safe",
                next: "find_route"
            },
            {
                text: "Don't waste time. Move quickly!",
                type: "urgent",
                next: "find_route"
            }
        ]
    }
};

