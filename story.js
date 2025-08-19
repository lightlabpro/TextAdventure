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
            "Hey, can you hear me? This is Alex Chen from the research vessel Meridian.",
            "I need your help... something's gone terribly wrong up here.",
            "Our ship was investigating an anomalous signal near Europa when we hit something. The hull is breached and we're losing life support.",
            "The captain and most of the crew... they didn't make it. I'm alone in the emergency pod bay."
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

    rush_to_pods: {
        id: 'rush_to_pods',
        messages: [
            "You're right! I'm heading to the pod bay now.",
            "Wait... the corridor is blocked by debris from the impact.",
            "I can see sparks coming from the damaged section. It looks dangerous but I might be able to squeeze through.",
            "Or I could take the maintenance shaft, but that would take longer..."
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
                text: "Wait, look for another way. There might be a service corridor.",
                type: "technical",
                next: "find_alternate_route"
            }
        ]
    },

    systems_check: {
        id: 'systems_check',
        character: {
            status: 'weak'
        },
        messages: [
            "Let me check... The main computers are down, but emergency systems are running on battery backup.",
            "Life support shows... 18 minutes of oxygen remaining in this section.",
            "The escape pods should have independent power sources, but I need to get to the bay to check their status.",
            "Wait, the communication array is damaged. That's why the signal is getting weaker."
        ],
        choices: [
            {
                text: "18 minutes is enough. Move carefully to the pod bay.",
                type: "safe",
                next: "careful_approach"
            },
            {
                text: "Try to boost the signal first so we don't lose contact.",
                type: "technical",
                next: "boost_signal"
            },
            {
                text: "Forget the signal. Run to the pods now!",
                type: "urgent",
                next: "oxygen_race"
            }
        ]
    },

    pod_status_check: {
        id: 'pod_status_check',
        messages: [
            "Good thinking. Let me access the pod bay status from here...",
            "I'm reading the emergency panel... Pod 1 shows a malfunction. Pod 2 appears operational.",
            "Pod 3... the status is unclear. Could be damaged or just a sensor issue.",
            "The bay door control is showing amber - might be manual override only."
        ],
        choices: [
            {
                text: "Head straight to Pod 2 since you know it's working.",
                type: "safe",
                next: "pod_2_direct"
            },
            {
                text: "Check Pod 3 first - might be your best option if it's actually working.",
                type: "technical",
                next: "investigate_pod_3"
            },
            {
                text: "Try to fix Pod 1's malfunction. More options are better.",
                type: "technical",
                next: "repair_pod_1"
            }
        ]
    },

    grab_supplies: {
        id: 'grab_supplies',
        messages: [
            "Smart thinking. There's an emergency supply locker right here.",
            "Got it... emergency rations, water, medical kit, and a portable oxygen tank.",
            "There's also a multi-tool and what looks like a backup communication device.",
            "This extra oxygen could be crucial. Now, which way to the pods?"
        ],
        choices: [
            {
                text: "Test the backup communicator first.",
                type: "technical",
                next: "test_backup_comm"
            },
            {
                text: "Head to the pod bay using the main corridor.",
                type: "safe",
                next: "main_corridor_approach"
            },
            {
                text: "Use the utility tunnels to avoid damaged areas.",
                type: "technical",
                next: "utility_tunnels"
            }
        ]
    },

    maintenance_shaft: {
        id: 'maintenance_shaft',
        messages: [
            "I'm in the shaft... it's cramped but seems stable.",
            "I can hear the hull creaking above me. This is definitely the safer route.",
            "Almost there... I can see the pod bay access hatch ahead.",
            "Made it! I'm in the pod bay now. Let me check the pods..."
        ],
        choices: [
            {
                text: "Great! What's the status of the escape pods?",
                type: "safe",
                next: "pod_bay_arrival_safe"
            }
        ]
    },

    debris_shortcut: {
        id: 'debris_shortcut',
        character: {
            status: 'weak'
        },
        messages: [
            "I'm pushing through... OW! A sharp piece of metal caught my leg!",
            "I'm bleeding but I'm through. The pod bay is just ahead.",
            "The sparks are getting worse behind me. That section might collapse soon.",
            "But I made it here faster... that has to count for something."
        ],
        choices: [
            {
                text: "Apply pressure to the wound first, then check the pods.",
                type: "safe",
                next: "treat_injury_then_pods"
            },
            {
                text: "Ignore the injury for now. Check the escape pods immediately.",
                type: "urgent",
                next: "pods_despite_injury"
            }
        ]
    },

    pod_bay_arrival_safe: {
        id: 'pod_bay_arrival_safe',
        messages: [
            "Pod 1 has a red warning light - looks like the launch system is damaged.",
            "Pod 2's systems are all green. Engines, life support, navigation - all operational.",
            "Pod 3... the status panel is dark. Could be a power issue or complete failure.",
            "The bay door mechanism looks intact, but I'll need to manually unlock it."
        ],
        choices: [
            {
                text: "Go with Pod 2. It's your best bet for survival.",
                type: "safe",
                next: "choose_pod_2"
            },
            {
                text: "Try to power up Pod 3 first. Could be just a minor issue.",
                type: "technical",
                next: "attempt_pod_3_repair"
            },
            {
                text: "See if you can quickly fix Pod 1's launch system.",
                type: "technical",
                next: "quick_pod_1_fix"
            }
        ]
    },

    choose_pod_2: {
        id: 'choose_pod_2',
        messages: [
            "Getting into Pod 2 now... systems are powering up.",
            "Life support is active, navigation is online. The engines are responding to pre-flight checks.",
            "Unlocking the bay door... there! I can see space through the opening.",
            "Ready to launch on your word. Once I leave, we'll lose contact until I reach a communication relay."
        ],
        choices: [
            {
                text: "Launch now! Get to safety!",
                type: "urgent",
                next: "successful_escape"
            },
            {
                text: "Wait - try to send a distress signal first.",
                type: "technical",
                next: "distress_signal_attempt"
            },
            {
                text: "Double-check all systems one more time.",
                type: "safe",
                next: "final_systems_check"
            }
        ]
    },

    successful_escape: {
        id: 'successful_escape',
        character: {
            status: 'online'
        },
        messages: [
            "Launching now! The pod is clear of the ship!",
            "I can see the Meridian behind me... it's completely dark now. The hull breach is massive.",
            "Navigation shows the nearest station is 6 hours away. I have enough supplies thanks to your guidance.",
            "The rescue beacon is active. I'm going to make it... because of you."
        ],
        gameOver: {
            title: "Mission Successful!",
            message: "Alex successfully escaped in Pod 2 and reached safety. Your careful guidance saved a life."
        }
    },

    distress_signal_attempt: {
        id: 'distress_signal_attempt',
        messages: [
            "Sending distress signal... come on, work...",
            "Got it! Signal transmitted with the Meridian's last known coordinates and crew status.",
            "This will help the investigation and might save other ships from the same fate.",
            "Now launching... pod is clear! Thank you for thinking of the bigger picture."
        ],
        gameOver: {
            title: "Hero's Escape!",
            message: "Alex escaped safely AND sent crucial data that prevented future disasters. Your foresight saved many lives."
        }
    },

    attempt_pod_3_repair: {
        id: 'attempt_pod_3_repair',
        messages: [
            "Let me check Pod 3's power coupling... just need to bypass this relay...",
            "Yes! The systems are coming online! This pod actually has newer navigation equipment.",
            "Wait... there's something wrong with the atmospheric seals. This pod might have been damaged in the impact.",
            "I could try to fix it, but that would take time I might not have."
        ],
        choices: [
            {
                text: "Forget Pod 3. Go back to Pod 2 immediately.",
                type: "safe",
                next: "return_to_pod_2"
            },
            {
                text: "Try a quick seal repair with the emergency kit.",
                type: "technical",
                next: "emergency_seal_repair"
            },
            {
                text: "Risk it. Launch with the compromised seals.",
                type: "urgent",
                next: "risky_launch"
            }
        ]
    },

    emergency_seal_repair: {
        id: 'emergency_seal_repair',
        character: {
            status: 'weak'
        },
        messages: [
            "Using the emergency sealant from the supply kit...",
            "The patch is holding, but I can hear the ship's hull failing behind me.",
            "Pod 3 systems show green across the board now. This might actually be the better choice.",
            "But the sealant is a temporary fix. I need to launch soon or find a permanent solution."
        ],
        choices: [
            {
                text: "Launch immediately with the temporary fix.",
                type: "urgent",
                next: "temporary_seal_escape"
            },
            {
                text: "Try to find permanent sealing materials in the pod.",
                type: "technical",
                next: "search_for_materials"
            }
        ]
    },

    temporary_seal_escape: {
        id: 'temporary_seal_escape',
        messages: [
            "Launching with Pod 3... the bay door is opening...",
            "I'm clear of the ship! The seal is holding so far.",
            "Wait... I'm detecting a slow pressure leak. The temporary fix is failing.",
            "I have maybe 2 hours before it becomes critical. The nearest station is 6 hours away..."
        ],
        gameOver: {
            title: "Risky Gamble",
            message: "Alex launched with compromised seals. The outcome depends on whether rescue arrives in time... Your technical skills gave them a fighting chance."
        }
    },

    return_to_pod_2: {
        id: 'return_to_pod_2',
        messages: [
            "You're right. Back to Pod 2 - the safe choice.",
            "But when I turn around... Pod 2's hatch is showing a malfunction warning now!",
            "Something must have happened while I was working on Pod 3. Maybe a power surge?",
            "I might be able to override it, but this is getting dangerous."
        ],
        choices: [
            {
                text: "Try the manual hatch override on Pod 2.",
                type: "technical",
                next: "manual_override_attempt"
            },
            {
                text: "Go back to Pod 3 and launch despite the seal issue.",
                type: "urgent",
                next: "forced_pod_3_choice"
            }
        ]
    },

    manual_override_attempt: {
        id: 'manual_override_attempt',
        messages: [
            "Working on the manual override... need to access the emergency panel...",
            "Got it! The hatch is opening, but the system is throwing more error codes.",
            "The launch sequence might be compromised. I could try an emergency launch, but it's risky.",
            "Or I could try to diagnose the problem, but the ship is really falling apart now."
        ],
        choices: [
            {
                text: "Emergency launch! Don't wait for diagnostics!",
                type: "urgent",
                next: "emergency_launch_pod_2"
            },
            {
                text: "Take 30 seconds to run a quick diagnostic.",
                type: "technical",
                next: "quick_diagnostic"
            }
        ]
    },

    emergency_launch_pod_2: {
        id: 'emergency_launch_pod_2',
        character: {
            status: 'offline'
        },
        messages: [
            "Emergency launch initiated! Pod 2 is launching...",
            "I'm clear! But... something's wrong with the communication system...",
            "The override damaged something. I'm losing contact with you...",
            "Thank you for everything... I hope this signal reaches..."
        ],
        gameOver: {
            title: "Emergency Escape",
            message: "Alex launched in an emergency escape but lost communications. Their fate remains unknown, but your quick thinking gave them the best possible chance."
        }
    },

    quick_diagnostic: {
        id: 'quick_diagnostic',
        character: {
            status: 'offline'
        },
        messages: [
            "Running diagnostic... navigation is fine, life support is... OH NO!",
            "A structural support beam just collapsed behind me! The whole section is coming apart!",
            "I have to launch NOW or I won't make it at all!",
            "Launching! I'm... [SIGNAL LOST]"
        ],
        gameOver: {
            title: "Too Late",
            message: "The ship's destruction caught up with Alex before they could escape safely. Sometimes hesitation costs everything. Their sacrifice won't be forgotten."
        }
    },

    // Additional story branches and endings would continue here...
    // This represents about 1/3 of a full Lifeline-style game

    final_systems_check: {
        id: 'final_systems_check',
        messages: [
            "Good idea. Let me double-check everything...",
            "Life support: optimal. Navigation: locked onto nearest station. Engines: ready.",
            "Communications: I'll lose contact in 3... 2... 1...",
            "Launching! See you on the other side!"
        ],
        gameOver: {
            title: "Perfect Escape!",
            message: "Alex escaped safely with all systems verified. Your methodical approach ensured the best possible outcome. Sometimes slow and steady really does win the race."
        }
    }
};

