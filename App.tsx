import React, { useState, useMemo } from 'react';
import { INITIAL_GROUPS } from './constants';
import { Header } from './components/Header';
import { PointsTable } from './components/PointsTable';
import { UpdateScoreModal } from './components/UpdateScoreModal';
import { AddGroupModal } from './components/AddGroupModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { Group } from './types';
import type { Team } from './types';

const App: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState<string>(INITIAL_GROUPS.length > 0 ? INITIAL_GROUPS[0].id : '');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);

  const activeGroup = useMemo(() => {
    return groups.find(g => g.id === activeGroupId);
  }, [groups, activeGroupId]);

  const sortedTeams = useMemo(() => {
    if (!activeGroup) return [];

    return [...activeGroup.teams]
      .sort((a, b) => b.totalPoints - a.totalPoints || b.killPoints - a.killPoints)
      .map((team, index) => ({ ...team, rank: index + 1 }));
  }, [activeGroup]);

  const handleUpdateScore = (updatedTeam: Team) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === activeGroupId) {
          const updatedTeams = group.teams.map(team =>
            team.id === updatedTeam.id ? updatedTeam : team
          );
          return { ...group, teams: updatedTeams };
        }
        return group;
      })
    );
    setEditingTeam(null);
  };

  const handleAddGroup = (groupName: string, newTeamNames: string[]) => {
    if (!groupName.trim() || newTeamNames.length === 0) {
      alert("Group name and at least one team name are required.");
      return;
    }

    const maxId = groups.reduce((max, group) => {
      const groupMax = group.teams.reduce((m, team) => Math.max(m, team.id), 0);
      return Math.max(max, groupMax);
    }, 0);

    const newTeams: Team[] = newTeamNames.map((name, index) => ({
      id: maxId + 1 + index,
      rank: 0,
      name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      roundsWon: 0,
      placementPoints: 0,
      killPoints: 0,
      totalPoints: 0,
    }));

    const newGroup: Group = {
      id: `group-${Date.now()}-${groupName.toLowerCase().replace(/\s+/g, '-')}`,
      name: groupName,
      teams: newTeams,
    };

    setGroups(prevGroups => [...prevGroups, newGroup]);
    setActiveGroupId(newGroup.id);
    setIsAddGroupModalOpen(false);
  };

  const handleDeleteGroup = (groupIdToDelete: string) => {
    if (!groupIdToDelete) return;

    const newGroups = groups.filter(g => g.id !== groupIdToDelete);
    setGroups(newGroups);

    if (activeGroupId === groupIdToDelete) {
      setActiveGroupId(newGroups.length > 0 ? newGroups[0].id : '');
    }

    setDeletingGroup(null);
  };

  const handleSelectTeamToEdit = (team: Team) => {
    setEditingTeam(team);
  };

  const handleCloseModal = () => {
    setEditingTeam(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="my-8">
          <div className="flex border-b border-gray-700 items-center flex-wrap">
            {groups.map(group => (
              <div key={group.id} className="group relative" role="tab" aria-controls={`panel-${group.id}`}>
                <button
                  onClick={() => setActiveGroupId(group.id)}
                  className={`pl-4 pr-8 py-3 text-sm sm:text-base font-medium transition-colors duration-200 focus:outline-none rounded-t-md ${
                    activeGroupId === group.id
                      ? 'border-b-2 border-blue-500 text-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-selected={activeGroupId === group.id}
                >
                  {group.name}
                </button>
                 <button
                  onClick={() => setDeletingGroup(group)}
                  className="absolute top-1/2 right-1 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-white hover:bg-red-500/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 z-10"
                  aria-label={`Delete group ${group.name}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
             <button
              onClick={() => setIsAddGroupModalOpen(true)}
              className="ml-4 my-1 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
              aria-label="Add new group"
            >
              + Add Group
            </button>
          </div>
        </div>

        <main>
          {activeGroup ? (
            <div id={`panel-${activeGroup.id}`} role="tabpanel">
              <PointsTable teams={sortedTeams} onEditTeam={handleSelectTeamToEdit} />
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold text-gray-300">Welcome!</h3>
              <p className="mt-2 text-gray-400">There are no tournament groups yet.</p>
              <p className="mt-4 text-gray-400">
                Click the <span className="font-semibold text-blue-400">+ Add Group</span> button to create one and get started.
              </p>
            </div>
          )}
        </main>
      </div>

      {editingTeam && (
        <UpdateScoreModal
          team={editingTeam}
          onSave={handleUpdateScore}
          onClose={handleCloseModal}
        />
      )}

      {isAddGroupModalOpen && (
        <AddGroupModal
          onSave={handleAddGroup}
          onClose={() => setIsAddGroupModalOpen(false)}
        />
      )}

      {deletingGroup && (
        <DeleteConfirmationModal
          group={deletingGroup}
          onConfirm={() => handleDeleteGroup(deletingGroup.id)}
          onClose={() => setDeletingGroup(null)}
        />
      )}
    </div>
  );
};

export default App;