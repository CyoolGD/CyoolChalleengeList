import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container" v-if="err.length > 0">
                    <p class="error">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard" :key="i">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="player-container" v-if="entry">
                    <div class="player">
                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>
                        <h3>{{ localize(entry.total) }}</h3>

                        <template v-if="entry.verified.length > 0">
                            <h2>Verified ({{ entry.verified.length }})</h2>
                            <table class="table">
                                <tr v-for="(score, index) in entry.verified" :key="'verified-' + index">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>
                        </template>

                        <template v-if="entry.completed.length > 0">
                            <h2>Completed ({{ entry.completed.length }})</h2>
                            <table class="table">
                                <tr v-for="(score, index) in entry.completed" :key="'completed-' + index">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">{{ score.level }}</a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>
                        </template>

                        <template v-if="entry.progressed.length > 0">
                            <h2>Progressed ({{ entry.progressed.length }})</h2>
                            <table class="table">
                                <tr v-for="(score, index) in entry.progressed" :key="'progressed-' + index">
                                    <td class="rank"><p>#{{ score.rank }}</p></td>
                                    <td class="level">
                                        <a class="type-label-lg" target="_blank" :href="score.link">
                                            {{ score.percent }}% {{ score.level }}
                                        </a>
                                    </td>
                                    <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                </tr>
                            </table>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected] || null;
        },
    },
    async mounted() {
        try {
            const [leaderboard, err] = await fetchLeaderboard();
            this.leaderboard = leaderboard || [];
            this.err = err || [];
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            this.err = ['An unexpected error occurred while fetching leaderboard data.'];
        } finally {
            this.loading = false;
        }
    },
    methods: {
        localize,
    },
};
