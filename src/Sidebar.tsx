import { StopCompletion } from "./App";

type SidebarProps = { visited: Array<StopCompletion> };

export const Sidebar = ({ visited }: SidebarProps) => {
    return (
        <div className="sidebar-container">
            <span className="sidebar-header">Besökta</span>
            {visited
                .sort(
                    (a, b) =>
                        new Date(b.at).getTime() - new Date(a.at).getTime()
                )
                .map((stop) => (
                    <div className="sidebar-card" key={stop.stopId}>
                        <h3>{stop.name}</h3>
                        {/* stop.at är string, inte Date :( */}
                        <p>{new Date(stop.at).toLocaleString()}</p>
                    </div>
                ))}
        </div>
    );
};
